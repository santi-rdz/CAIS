import { prisma } from '#config/prisma.js'
import { Rec24hModel } from '#models/nutricion/Rec24h.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

export class Rec24hController {
  static async create(req, res) {
    const rec = await prisma.$transaction(async (tx) => {
      const r = await Rec24hModel.create(req.body, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.REC_24H,
          objetivo_id: r.id,
          paciente_id: r.paciente_id,
        },
        tx
      )
      return r
    })
    return res.status(201).json({ message: 'Recordatorio de 24 horas registrado', rec })
  }

  static async getAll(req, res) {
    const { historia_paciente_id } = req.query
    const { page, limit } = parsePagination(req.query)

    const result = await Rec24hModel.getAll({ historia_paciente_id, page, limit })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const rec = await Rec24hModel.getById(id)
    res.json(rec)
  }

  static async delete(req, res) {
    const { id } = req.params
    const rec = await prisma.$transaction(async (tx) => {
      const r = await Rec24hModel.delete(id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.REC_24H,
          objetivo_id: r.id,
          paciente_id: r.paciente_id,
        },
        tx
      )
      return r
    })
    res.json(rec)
  }

  static async update(req, res) {
    const { id } = req.params
    const updatedRec = await prisma.$transaction(async (tx) => {
      const r = await Rec24hModel.update(id, req.body, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ACTUALIZAR,
          entidad: ENTIDADES.REC_24H,
          objetivo_id: r.id,
          paciente_id: r.paciente_id,
        },
        tx
      )
      return r
    })
    res.json(updatedRec)
  }
}
