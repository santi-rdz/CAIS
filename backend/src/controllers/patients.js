import { PatientModel } from '#models/PatientModel.js'
import {
  validatePatient,
  validatePartialPatient,
} from '@cais/shared/schemas/medicina/patient'
import { formatZodErrors } from '#lib/formatErrors.js'
import { parsePagination } from '#lib/paginate.js'

export class PatientController {
  static async create(req, res) {
    const result = validatePatient(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const patient = await PatientModel.create(result.data, req.session.userId)
      return res.status(201).json({ message: 'Paciente registrado', patient })
    } catch (error) {
      console.error('Error creating patient:', error)
      return res.status(500).json({ error: 'Error al registrar al paciente' })
    }
  }

  static async getAll(req, res) {
    const { sortBy, search, genre } = req.query
    const { page, limit } = parsePagination(req.query)

    const patients = await PatientModel.getAll({
      sortBy,
      search,
      genre,
      page,
      limit,
    })
    res.json(patients)
  }

  static async getById(req, res) {
    const { id } = req.params
    const patient = await PatientModel.getById(id)
    if (!patient)
      return res.status(404).json({ message: 'Paciente no encontrado' })
    res.json(patient)
  }

  static async delete(req, res) {
    const { id } = req.params
    const success = await PatientModel.delete(id)
    if (!success)
      return res.status(404).json({ message: 'Paciente no encontrado' })
    res.json({ message: 'Paciente borrado exitosamente' })
  }

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
