import { MedicalHistoryModel } from '#models/medicina/MedicalHistory.js'
import {
  validateMedicalHistory,
  validatePartialMedicalHistory,
} from '@cais/shared/schemas/medicina/medicalHistory'
import { formatZodErrors } from '#lib/formatErrors.js'
import { parsePagination } from '#lib/paginate.js'

export class MedicalHistoryController {
  static async create(req, res) {
    const result = validateMedicalHistory(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de historia médica inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const history = await MedicalHistoryModel.create(result.data)
      return res
        .status(201)
        .json({ message: 'Historia médica registrada', history })
    } catch (error) {
      console.error('Error al crear historia médica:', error)
      return res
        .status(500)
        .json({ error: 'Error al registrar historia médica' })
    }
  }

  static async getAll(req, res) {
    const { paciente_id } = req.query
    const { page, limit } = parsePagination(req.query)

    const result = await MedicalHistoryModel.getAll({
      paciente_id,
      page,
      limit,
    })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const history = await MedicalHistoryModel.getById(id)
    if (!history)
      return res.status(404).json({ message: 'Historia médica no encontrada' })
    res.json(history)
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const history = await MedicalHistoryModel.delete(id)
      if (!history)
        return res
          .status(404)
          .json({ message: 'Historia médica no encontrada' })
      res.json(history)
    } catch (err) {
      console.error('Error al eliminar historia médica:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar historia médica',
      })
    }
  }

  static async update(req, res) {
    const result = validatePartialMedicalHistory(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    const { id } = req.params
    try {
      const updatedHistory = await MedicalHistoryModel.update(id, result.data)
      if (!updatedHistory)
        return res
          .status(404)
          .json({ message: 'Historia médica no encontrada' })
      res.json(updatedHistory)
    } catch (err) {
      console.error('Error al actualizar historia médica:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar historia médica',
      })
    }
  }
}
