import { formatZodErrors } from '#lib/formatErrors.js'
import { parsePagination } from '#lib/paginate.js'
import { EmergencyModel } from '#models/medicina/EmergencyModel.js'
import {
  validateEmergency,
  validatePartialEmergency,
} from '@cais/shared/schemas/medicina/emergency'

export class EmergencyController {
  static async create(req, res) {
    const result = validateEmergency(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de emergencia inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const emergency = await EmergencyModel.create(
        result.data,
        req.session.userId
      )
      return res
        .status(201)
        .json({ message: 'Emergencia registrada', emergency })
    } catch (error) {
      console.error('Error creating emergency:', error)
      return res.status(500).json({ error: 'Error al registrar emergencia' })
    }
  }

  static async getAll(req, res) {
    const { sortBy, search, recurrente } = req.query
    const { page, limit } = parsePagination(req.query)
    const recurrentBoolean =
      recurrente === 'true' ? true : recurrente === 'false' ? false : null

    const emergencies = await EmergencyModel.getAll({
      sortBy,
      search,
      page,
      limit,
      recurrentBoolean,
    })
    res.json(emergencies)
  }

  static async getById(req, res) {
    const { id } = req.params
    const emergency = await EmergencyModel.getById(id)
    if (!emergency)
      return res.status(404).json({ message: 'Emergencia no encontrada' })
    res.json(emergency)
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const emergency = await EmergencyModel.delete(id)
      if (!emergency)
        return res.status(404).json({ message: 'Emergencia no encontrada' })
      res.json(emergency)
    } catch (err) {
      console.error('Error al eliminar emergencia:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar emergencia',
      })
    }
  }

  static async update(req, res) {
    const result = validatePartialEmergency(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    const { id } = req.params
    try {
      const updatedEmergency = await EmergencyModel.update(id, result.data)
      if (!updatedEmergency)
        return res.status(404).json({ message: 'Emergencia no encontrada' })
      res.json(updatedEmergency)
    } catch (err) {
      console.error('Error al actualizar emergencia:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar emergencia',
      })
    }
  }
}
