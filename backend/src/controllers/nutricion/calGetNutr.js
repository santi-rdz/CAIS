import { prisma } from '#config/prisma.js'
import { CalGetNutrModel } from '#models/nutricion/CalGetNutr.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

export class CalGetNutrController {
  static async create(req, res) {
    const registro = await prisma.$transaction(async (tx) => {
      const r = await CalGetNutrModel.create(req.body, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.CAL_GET_NUTR,
          objetivo_id: r.id,
          paciente_id: r.paciente_id,
        },
        tx
      )
      return r
    })
    return res.status(201).json({ message: 'Cálculo de GET nutricional registrado', registro })
  }

  static async getAll(req, res) {
    const { historia_paciente_id } = req.query
    const { page, limit } = parsePagination(req.query)

    const result = await CalGetNutrModel.getAll({ historia_paciente_id, page, limit })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const registro = await CalGetNutrModel.getById(id)
    res.json(registro)
  }

  static async delete(req, res) {
    const { id } = req.params
    const registro = await prisma.$transaction(async (tx) => {
      const r = await CalGetNutrModel.delete(id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.CAL_GET_NUTR,
          objetivo_id: r.id,
          paciente_id: r.paciente_id,
        },
        tx
      )
      return r
    })
    res.json(registro)
  }

  static async update(req, res) {
    const { id } = req.params
    const updated = await prisma.$transaction(async (tx) => {
      const r = await CalGetNutrModel.update(id, req.body, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ACTUALIZAR,
          entidad: ENTIDADES.CAL_GET_NUTR,
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
