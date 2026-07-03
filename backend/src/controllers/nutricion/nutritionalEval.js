import { prisma } from '#config/prisma.js'
import { NutritionalEvalModel } from '#models/nutricion/NutritionalEval.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

const LISTABLE_FIELDS = new Set(['id', 'historia_paciente_id', 'fecha', 'creado_at'])

export class NutritionalEvalController {
  static async create(req, res) {
    const evaluation = await prisma.$transaction(async (tx) => {
      const h = await NutritionalEvalModel.create(req.body, tx)
      await PatientModel.touch(h.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.EVAL_NUTRICIONAL,
          objetivo_id: h.id,
          paciente_id: h.paciente_id,
        },
        tx
      )
      return h
    })
    return res.status(201).json({ message: 'Evaluación nutricional registrada', evaluation })
  }

  static async getAll(req, res) {
    const { historia_paciente_id, fields } = req.query
    const { page, limit } = parsePagination(req.query)
    if (fields !== undefined && typeof fields !== 'string') {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "fields" debe ser una cadena separada por comas',
      })
    }

    const parsedFields = fields
      ? fields
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
      : null

    if (parsedFields && parsedFields.some((field) => !LISTABLE_FIELDS.has(field))) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "fields" contiene valores no permitidos',
      })
    }

    const result = await NutritionalEvalModel.getAll({
      historia_paciente_id,
      page,
      limit,
      fields: parsedFields,
    })
    return res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const evaluation = await NutritionalEvalModel.getById(id)
    return res.json(evaluation)
  }

  static async delete(req, res) {
    const { id } = req.params
    const evaluation = await prisma.$transaction(async (tx) => {
      const h = await NutritionalEvalModel.delete(id, tx)
      await PatientModel.touch(h.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.EVAL_NUTRICIONAL,
          objetivo_id: h.id,
          paciente_id: h.paciente_id,
        },
        tx
      )
      return h
    })
    res.json(evaluation)
  }

  static async update(req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Se requiere al menos un campo para actualizar',
      })
    }

    const { id } = req.params
    const updatedEvaluation = await prisma.$transaction(async (tx) => {
      const h = await NutritionalEvalModel.update(id, req.body, tx)
      await PatientModel.touch(h.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ACTUALIZAR,
          entidad: ENTIDADES.EVAL_NUTRICIONAL,
          objetivo_id: h.id,
          paciente_id: h.paciente_id,
        },
        tx
      )
      return h
    })
    res.json({ evaluation: updatedEvaluation })
  }
}
