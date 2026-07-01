import { prisma } from '#config/prisma.js'
import { NutritionHistoryModel } from '#models/nutricion/NutritionHistory.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

export class NutritionHistoryController {
  static async create(req, res) {
    const history = await prisma.$transaction(async (tx) => {
      const h = await NutritionHistoryModel.create(req.body, tx)
      await PatientModel.touch(req.body.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.HISTORIA_NUTRICION,
          objetivo_id: h.id,
          paciente_id: h.paciente_id,
        },
        tx
      )
      return h
    })
    return res.status(201).json({ message: 'Historia de nutrición registrada', history })
  }

  static async getAll(req, res) {
    const { paciente_id, fields } = req.query
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

    const result = await NutritionHistoryModel.getAll({
      paciente_id,
      page,
      limit,
      fields: parsedFields,
    })
    return res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const history = await NutritionHistoryModel.getById(id)
    return res.json(history)
  }

  static async delete(req, res) {
    const { id } = req.params
    const history = await prisma.$transaction(async (tx) => {
      const h = await NutritionHistoryModel.delete(id, tx)
      await PatientModel.touch(h.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.HISTORIA_NUTRICION,
          objetivo_id: h.id,
          paciente_id: h.paciente_id,
        },
        tx
      )
      return h
    })
    res.json(history)
  }

  static async update(req, res) {
    const { id } = req.params
    const updatedHistory = await prisma.$transaction(async (tx) => {
      const h = await NutritionHistoryModel.update(id, req.body, tx)
      await PatientModel.touch(h.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ACTUALIZAR,
          entidad: ENTIDADES.HISTORIA_NUTRICION,
          objetivo_id: h.id,
          paciente_id: h.paciente_id,
        },
        tx
      )
      return h
    })
    res.json(updatedHistory)
  }
}
