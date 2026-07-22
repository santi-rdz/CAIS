import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES, ROLES } from '@cais/shared/constants/users'
import { prisma } from '#config/prisma.js'
import { NotFoundError, ForbiddenError, ConflictError } from '#lib/appError.js'
import { canAccessPatient } from '#lib/patientAccess.js'

export class PatientController {
  static async create(req, res) {
    if (req.session.areaId == null) {
      throw new ForbiddenError('Área no definida para este usuario')
    }
    const patient = await prisma.$transaction(async (tx) => {
      const p = await PatientModel.create(req.body, req.session.userId, req.session.areaId, tx)
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
    res.status(201).json({ message: 'Paciente registrado', patient })
  }

  static async getSimilar(req, res) {
    if (req.session.areaId == null) {
      throw new ForbiddenError('Área no definida para este usuario')
    }
    const similares = await PatientModel.findSimilar({
      ...req.validatedQuery,
      excludeAreaId: req.session.areaId,
    })
    res.json({ similares })
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
      throw new NotFoundError('el paciente')
    }
    res.json(patient)
  }

  static async delete(req, res) {
    const { id } = req.params
    await prisma.$transaction(async (tx) => {
      const existing = await PatientModel.getById(id, tx)
      if (!canAccessPatient(existing, req.session)) {
        throw new NotFoundError('el paciente')
      }
      // Compartido: solo admin puede el borrado completo.
      if (existing.areas.length > 1 && req.session.role !== ROLES.ADMIN) {
        throw new ConflictError('El paciente está sincronizado con otra área')
      }

      await PatientModel.delete(id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.PACIENTE,
          objetivo_id: id,
        },
        tx
      )
    })
    res.json({ message: 'Paciente borrado exitosamente' })
  }

  static async update(req, res) {
    const { id } = req.params
    const updatedPatient = await prisma.$transaction(async (tx) => {
      const existing = await PatientModel.getById(id, tx)
      if (!canAccessPatient(existing, req.session)) {
        throw new NotFoundError('el paciente')
      }

      const p = await PatientModel.update(id, req.body, tx)
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
    res.json(updatedPatient)
  }
}
