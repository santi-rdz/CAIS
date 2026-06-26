import { prisma } from '#config/prisma.js'
import { MedicalHistoryModel } from '#models/medicina/MedicalHistory.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

export class MedicalHistoryController {
  static async create(req, res) {
    try {
      const history = await prisma.$transaction(async (tx) => {
        const h = await MedicalHistoryModel.create(req.body, req.session.userId, tx)
        await PatientModel.touch(req.body.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.CREAR,
            entidad: ENTIDADES.HISTORIA_MEDICA,
            objetivo_id: h.id,
            paciente_id: h.paciente_id,
          },
          tx
        )
        return h
      })
      return res.status(201).json({ message: 'Historia médica registrada', history })
    } catch (error) {
      console.error('Error al crear historia médica:', error)
      return res.status(500).json({ message: 'Error al registrar historia médica' })
    }
  }

  static async getAll(req, res) {
    const { paciente_id, fields } = req.query
    const { page, limit } = parsePagination(req.query)

    const parsedFields = fields
      ? fields
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
      : null

    const result = await MedicalHistoryModel.getAll({
      paciente_id,
      page,
      limit,
      fields: parsedFields,
    })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const history = await MedicalHistoryModel.getById(id)
    if (!history) return res.status(404).json({ message: 'Historia médica no encontrada' })
    res.json(history)
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const history = await prisma.$transaction(async (tx) => {
        const h = await MedicalHistoryModel.delete(id, tx)
        if (!h) return null
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ELIMINAR,
            entidad: ENTIDADES.HISTORIA_MEDICA,
            objetivo_id: h.id,
            paciente_id: h.paciente_id,
          },
          tx
        )
        return h
      })
      if (!history) return res.status(404).json({ message: 'Historia médica no encontrada' })
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
    const { id } = req.params
    try {
      const updatedHistory = await prisma.$transaction(async (tx) => {
        const h = await MedicalHistoryModel.update(id, req.body, req.session.userId, tx)
        if (!h) return null
        await PatientModel.touch(h.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ACTUALIZAR,
            entidad: ENTIDADES.HISTORIA_MEDICA,
            objetivo_id: h.id,
            paciente_id: h.paciente_id,
          },
          tx
        )
        return h
      })
      if (!updatedHistory) return res.status(404).json({ message: 'Historia médica no encontrada' })
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
