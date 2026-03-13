import { PatientModel } from '#models/PatientModel.js'
import {
  validatePatient,
  validatePartialPatient,
} from '@cais/shared/schemas/medicina/patient'
import { formatZodErrors } from '#lib/formatErrors.js'

export class PatientController {
  /**
   * POST /pacientes
   * Registrar paciente.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async create(req, res) {
    const validation = validatePatient(req.body)
    if (!validation.success) {
      return res.status(422).json({ error: validation.error.issues })
    }

    try {
      const patient = await PatientModel.create(
        validation.data,
        req.session.userId
      )
      return res.status(201).json({ message: 'Paciente registrado', patient })
    } catch (error) {
      console.error('Error creating patient:', error)
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
    const patients = await PatientModel.getAll({
      sortBy,
      search,
      page,
      limit,
    })
    res.json(patients)
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
    const patient = await PatientModel.getById(id)
    if (!patient)
      return res.status(404).json({ message: 'Paciente no encontrada' })
    res.json(patient)
  }

  /**
   * DELETE /pacientes/:id
   * Borra a un paciente.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async delete(req, res) {
    const { id } = req.params
    const success = await PatientModel.delete(id)
    if (!success)
      return res.status(404).json({ message: 'Paciente no encontrado' })
    res.json({ message: 'Paciente borrado exitosamente' })
  }

  /**
   * PATCH /pacientes/:id
   * Actualiza los datos de un paciente.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async update(req, res) {
    const result = validatePartialPatient(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    const { id } = req.params
    try {
      const updatedPatient = await PatientModel.update(id, result.data)
      if (!updatedPatient)
        return res.status(404).json({ message: 'Paciente no encontrado' })
      res.json(updatedPatient)
    } catch (err) {
      console.error('Error al actualizar al paciente:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar paciente',
      })
    }
  }
}
