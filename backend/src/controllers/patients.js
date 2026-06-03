import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { validatePatient, validatePartialPatient } from '@cais/shared/schemas/medicina/patient'
import { formatZodErrors } from '#lib/formatErrors.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES, ROLES } from '@cais/shared/constants/users'
import { prisma } from '#config/prisma.js'

// Devolver 404 en vez de 403 para no revelar la existencia del paciente.
function canAccessPatient(patient, session) {
  if (!patient) return false
  if (session.role === ROLES.ADMIN) return true
  return patient.doctor_area_id != null && patient.doctor_area_id === session.areaId
}

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
      const patient = await prisma.$transaction(async (tx) => {
        const p = await PatientModel.create(result.data, req.session.userId, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.CREAR,
            entidad: ENTIDADES.PACIENTE,
            objetivo_id: p.id,
            paciente_id: p.id,
          },
          tx
        )
        return p
      })
      return res.status(201).json({ message: 'Paciente registrado', patient })
    } catch (error) {
      console.error('Error creating patient:', error)
      return res.status(500).json({ error: 'Error al registrar al paciente' })
    }
  }

  static async getAll(req, res) {
    const { sortBy, search, genre } = req.query
    const { page, limit } = parsePagination(req.query)
    const areaId = req.session.role === ROLES.ADMIN ? null : req.session.areaId

    const patients = await PatientModel.getAll({
      sortBy,
      search,
      genre,
      page,
      limit,
      areaId,
    })
    res.json(patients)
  }

  static async getById(req, res) {
    const { id } = req.params
    const patient = await PatientModel.getById(id)
    if (!canAccessPatient(patient, req.session)) {
      return res.status(404).json({ message: 'Paciente no encontrado' })
    }
    res.json(patient)
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const success = await prisma.$transaction(async (tx) => {
        const existing = await PatientModel.getById(id, tx)
        if (!canAccessPatient(existing, req.session)) return false

        const result = await PatientModel.delete(id, tx)
        if (!result) return false
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ELIMINAR,
            entidad: ENTIDADES.PACIENTE,
            objetivo_id: id,
          },
          tx
        )
        return true
      })
      if (!success) return res.status(404).json({ message: 'Paciente no encontrado' })
      res.json({ message: 'Paciente borrado exitosamente' })
    } catch (err) {
      console.error('Error al eliminar paciente:', err)
      res.status(500).json({ error: 'InternalError', message: 'Error al eliminar paciente' })
    }
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
      const updatedPatient = await prisma.$transaction(async (tx) => {
        const existing = await PatientModel.getById(id, tx)
        if (!canAccessPatient(existing, req.session)) return null

        const p = await PatientModel.update(id, result.data, tx)
        if (!p) return null
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ACTUALIZAR,
            entidad: ENTIDADES.PACIENTE,
            objetivo_id: p.id,
            paciente_id: p.id,
          },
          tx
        )
        return p
      })
      if (!updatedPatient) return res.status(404).json({ message: 'Paciente no encontrado' })
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
