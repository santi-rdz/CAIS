import { PacientModel } from '../models/PacientModel.js'
import { validatePacient } from '../schemas/pacient.js'

export class PacientController {
  /**
   * POST /pacientes
   * Registrar paciente.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async create(req, res) {
    const validation = validatePacient(req.body)
    if (!validation.success) {
      return res.status(422).json({ error: validation.error.issues })
    }

    try {
      const pacient = await PacientModel.create(
        validation.data,
        req.session.userId
      )
      return res.status(201).json({ message: 'Paciente registrado', pacient })
    } catch (error) {
      console.error('Error creating pacient:', error)
      return res.status(500).json({ error: 'Error al registrar al paciente' })
    }
  }

  /**
   * GET /pacientes
   * Listar pacientes.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async getAll(req, res) {
    const { sortBy, search } = req.query
    const page = +req.query.page || 1
    const limit = +req.query.limit || 10
    const pacients = await PacientModel.getAll({
      sortBy,
      search,
      page,
      limit,
    })
    res.json(pacients)
  }

  /**
   * GET /pacientes/:id
   * Obtiene los detalles de un paciente específico mediante su ID.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async getById(req, res) {
    const { id } = req.params
    const pacient = await PacientModel.getById(id)
    if (!pacient)
      return res.status(404).json({ message: 'Paciente no encontrada' })
    res.json(pacient)
  }
}
