import { prisma } from '#config/prisma.js'
import { EvalActFisicaModel } from '#models/nutricion/EvalActFisica.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { isUUID } from '@cais/shared/schemas/fields'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

const LISTABLE_FIELDS = new Set(['id', 'historia_paciente_id', 'fecha'])

export class EvalActFisicaController {
  static async create(req, res) {
    const evaluacion = await prisma.$transaction(async (tx) => {
      const e = await EvalActFisicaModel.create(req.body, tx)
      await PatientModel.touch(e.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.HISTORIA_NUTRICION,
          objetivo_id: null,
          paciente_id: e.paciente_id,
        },
        tx
      )
      return e
    })
    return res
      .status(201)
      .json({ message: 'Evaluación de actividad física registrada', evaluacion })
  }

  static async getAll(req, res) {
    const { historia_paciente_id, fields } = req.query
    const { page, limit } = parsePagination(req.query)

    if (historia_paciente_id !== undefined && !isUUID(historia_paciente_id)) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "historia_paciente_id" debe ser un UUID válido',
      })
    }

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

    const result = await EvalActFisicaModel.getAll({
      historia_paciente_id,
      page,
      limit,
      fields: parsedFields,
    })
    return res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const evaluacion = await EvalActFisicaModel.getById(id)
    return res.json(evaluacion)
  }

  static async delete(req, res) {
    const { id } = req.params
    const evaluacion = await prisma.$transaction(async (tx) => {
      const e = await EvalActFisicaModel.delete(id, tx)
      await PatientModel.touch(e.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.HISTORIA_NUTRICION,
          objetivo_id: null,
          paciente_id: e.paciente_id,
        },
        tx
      )
      return e
    })
    res.json(evaluacion)
  }

  static async update(req, res) {
    const { id } = req.params
    const updated = await prisma.$transaction(async (tx) => {
      const e = await EvalActFisicaModel.update(id, req.body, tx)
      await PatientModel.touch(e.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ACTUALIZAR,
          entidad: ENTIDADES.HISTORIA_NUTRICION,
          objetivo_id: null,
          paciente_id: e.paciente_id,
        },
        tx
      )
      return e
    })
    res.json(updated)
  }
}
