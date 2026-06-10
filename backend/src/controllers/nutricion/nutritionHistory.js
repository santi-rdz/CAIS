import { prisma } from '#config/prisma.js'
import { NutritionHistoryModel } from '#models/nutricion/NutritionHistory.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import {
  validateNutritionHistory,
  validatePartialNutritionHistory,
} from '@cais/shared/schemas/nutricion/nutritionHistory'
import { formatZodErrors } from '#lib/formatErrors.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

export class NutritionHistoryController {
  static async create(req, res) {
    const result = validateNutritionHistory(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de historia de nutrición inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const history = await prisma.$transaction(async (tx) => {
        const h = await NutritionHistoryModel.create(result.data, tx)
        await PatientModel.touch(result.data.paciente_id, tx)
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
    } catch (error) {
      console.error('Error al crear historia de nutrición:', error)
      return res.status(500).json({ message: 'Error al registrar historia de nutrición' })
    }
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

    try {
      const result = await NutritionHistoryModel.getAll({
        paciente_id,
        page,
        limit,
        fields: parsedFields,
      })
      return res.json(result)
    } catch (err) {
      console.error('Error al obtener historias de nutrición:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener historias de nutrición',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params
    try {
      const history = await NutritionHistoryModel.getById(id)
      if (!history) return res.status(404).json({ message: 'Historia de nutrición no encontrada' })
      return res.json(history)
    } catch (err) {
      console.error('Error al obtener historia de nutrición:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener historia de nutrición',
      })
    }
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const history = await prisma.$transaction(async (tx) => {
        const h = await NutritionHistoryModel.delete(id, tx)
        if (!h) return null
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
      if (!history) return res.status(404).json({ message: 'Historia de nutrición no encontrada' })
      res.json(history)
    } catch (err) {
      console.error('Error al eliminar historia de nutrición:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar historia de nutrición',
      })
    }
  }

  static async update(req, res) {
    const result = validatePartialNutritionHistory(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    const { id } = req.params
    try {
      const updatedHistory = await prisma.$transaction(async (tx) => {
        const h = await NutritionHistoryModel.update(id, result.data, tx)
        if (!h) return null
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
      if (!updatedHistory)
        return res.status(404).json({ message: 'Historia de nutrición no encontrada' })
      res.json(updatedHistory)
    } catch (err) {
      console.error('Error al actualizar historia de nutrición:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar historia de nutrición',
      })
    }
  }
}
