import { prisma } from '#config/prisma.js'
import { ReporteEenModel } from '#models/nutricion/ReporteEen.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

export class ReporteEenController {
  static async create(req, res) {
    const reporte = await prisma.$transaction(async (tx) => {
      const r = await ReporteEenModel.create(req.body, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.REPORTE_EEN,
          objetivo_id: r.id,
          paciente_id: r.paciente_id,
        },
        tx
      )
      return r
    })
    return res.status(201).json({ message: 'Reporte EEN registrado', reporte })
  }

  static async getAll(req, res) {
    const { historia_paciente_id } = req.query
    const { page, limit } = parsePagination(req.query)
    const result = await ReporteEenModel.getAll({ historia_paciente_id, page, limit })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const reporte = await ReporteEenModel.getById(id)
    res.json(reporte)
  }

  static async delete(req, res) {
    const { id } = req.params
    const reporte = await prisma.$transaction(async (tx) => {
      const r = await ReporteEenModel.delete(id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.REPORTE_EEN,
          objetivo_id: r.id,
          paciente_id: r.paciente_id,
        },
        tx
      )
      return r
    })
    res.json(reporte)
  }

  static async update(req, res) {
    const { id } = req.params
    const updated = await prisma.$transaction(async (tx) => {
      const r = await ReporteEenModel.update(id, req.body, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ACTUALIZAR,
          entidad: ENTIDADES.REPORTE_EEN,
          objetivo_id: r.id,
          paciente_id: r.paciente_id,
        },
        tx
      )
      return r
    })
    res.json(updated)
  }
}
