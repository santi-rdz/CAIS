import { parsePagination } from '#lib/paginate.js'
import { EmergencyModel } from '#models/medicina/EmergencyModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'
import { prisma } from '#config/prisma.js'

export class EmergencyController {
  static async create(req, res) {
    const emergency = await prisma.$transaction(async (tx) => {
      const e = await EmergencyModel.create(req.body, req.session.userId, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.EMERGENCIA,
          objetivo_id: e.id,
        },
        tx
      )
      return e
    })
    res.status(201).json({ message: 'Emergencia registrada', emergency })
  }

  static async getAll(req, res) {
    const { sortBy, search, recurrente } = req.query
    const { page, limit } = parsePagination(req.query)
    const recurrentBoolean = recurrente === 'true' ? true : recurrente === 'false' ? false : null

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
    if (!emergency) return res.status(404).json({ message: 'Emergencia no encontrada' })
    res.json(emergency)
  }

  static async delete(req, res) {
    const { id } = req.params
    const emergency = await prisma.$transaction(async (tx) => {
      const e = await EmergencyModel.delete(id, tx)
      if (!e) return null
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.EMERGENCIA,
          objetivo_id: e.id,
        },
        tx
      )
      return e
    })
    if (!emergency) return res.status(404).json({ message: 'Emergencia no encontrada' })
    res.json(emergency)
  }

  static async update(req, res) {
    const { id } = req.params
    const updatedEmergency = await prisma.$transaction(async (tx) => {
      const e = await EmergencyModel.update(id, req.body, tx)
      if (!e) return null
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ACTUALIZAR,
          entidad: ENTIDADES.EMERGENCIA,
          objetivo_id: e.id,
        },
        tx
      )
      return e
    })
    if (!updatedEmergency) return res.status(404).json({ message: 'Emergencia no encontrada' })
    res.json(updatedEmergency)
  }
}
