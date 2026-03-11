import { formatZodErrors } from '../lib/formatErrors.js'
import { EmergencyModel } from '../models/EmergencyModel.js'
import {
  validateEmergency,
  validatePartialEmergency,
} from '../schemas/emergency.js'
import { formatZodErrors } from '../lib/formatErrors.js'

export class EmergencyController {
  /**
   * POST /emergencias
   * Registrar emergencia.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async create(req, res) {
    const validation = validateEmergency(req.body)
    if (!validation.success) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de emergencia inválidos',
        fields: formatZodErrors(validation.error),
      })
    }

    try {
      const emergency = await EmergencyModel.create(
        validation.data,
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

  /**
   * GET /emergencias
   * Listar bitácora de emergencias.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async getAll(req, res) {
    const { sortBy, search, recurrente } = req.query
    const page = +req.query.page || 1
    const limit = +req.query.limit || 10
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

  /**
   * GET /emergencias/:id
   * Obtiene los detalles de una emergencia específico mediante su ID.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async getById(req, res) {
    const { id } = req.params
    const emergency = await EmergencyModel.getById(id)
    if (!emergency)
      return res.status(404).json({ message: 'Emergencia no encontrada' })
    res.json(emergency)
  }

  /**
   * PATCH /emergencias/:id
   * Editar una emergencia específica mediante su ID.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
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
