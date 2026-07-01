import { prisma } from '#config/prisma.js'
import { TpanNutritionModel } from '#models/nutricion/TpanNutrition.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { isUUID } from '@cais/shared/schemas/fields'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

const LISTABLE_FIELDS = new Set(['id', 'paciente_id', 'fecha_eval'])

export class TpanNutritionController {
  static async create(req, res) {
    const tpan = await prisma.$transaction(async (tx) => {
      const t = await TpanNutritionModel.create(req.body, tx)
      await PatientModel.touch(req.body.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.TPAN,
          objetivo_id: null,
          paciente_id: t.paciente_id,
        },
        tx
      )
      return t
    })
    return res.status(201).json({ message: 'TPAN registrado', tpan })
  }

  static async getAll(req, res) {
    const { paciente_id, fields } = req.query
    const { page, limit } = parsePagination(req.query)

    if (paciente_id !== undefined && !isUUID(paciente_id)) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "paciente_id" debe ser un UUID válido',
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

    const result = await TpanNutritionModel.getAll({
      paciente_id,
      page,
      limit,
      fields: parsedFields,
    })
    return res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const tpan = await TpanNutritionModel.getById(id)
    return res.json(tpan)
  }

  static async delete(req, res) {
    const { id } = req.params
    const tpan = await prisma.$transaction(async (tx) => {
      const t = await TpanNutritionModel.delete(id, tx)
      await PatientModel.touch(t.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.TPAN,
          objetivo_id: null,
          paciente_id: t.paciente_id,
        },
        tx
      )
      return t
    })
    res.json(tpan)
  }

  static async update(req, res) {
    const { id } = req.params
    const updatedTpan = await prisma.$transaction(async (tx) => {
      const t = await TpanNutritionModel.update(id, req.body, tx)
      await PatientModel.touch(t.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ACTUALIZAR,
          entidad: ENTIDADES.TPAN,
          objetivo_id: null,
          paciente_id: t.paciente_id,
        },
        tx
      )
      return t
    })
    res.json(updatedTpan)
  }
}
