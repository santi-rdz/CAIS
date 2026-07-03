import { prisma } from '#config/prisma.js'
import { AnthropometricEvalModel } from '#models/nutricion/AnthropometricEval.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'
import { isUUID } from '@cais/shared/schemas/fields'
import { ValidationError } from '#lib/appError.js'

export class AnthropometricEvalController {
  static async create(req, res) {
    const evalAntro = await prisma.$transaction(async (tx) => {
      const e = await AnthropometricEvalModel.create(req.body, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.EVAL_ANTROPOMETRICA,
          objetivo_id: e.id,
          paciente_id: e.paciente_id,
        },
        tx
      )
      return e
    })
    return res.status(201).json({ message: 'Evaluación antropométrica registrada', evalAntro })
  }

  static async getAll(req, res) {
    const { historia_paciente_id } = req.query
    if (historia_paciente_id && !isUUID(historia_paciente_id)) {
      throw new ValidationError('El historia_paciente_id debe ser un UUID válido')
    }
    const { page, limit } = parsePagination(req.query)

    const result = await AnthropometricEvalModel.getAll({
      historia_paciente_id,
      page,
      limit,
    })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const evalAntro = await AnthropometricEvalModel.getById(id)
    res.json(evalAntro)
  }

  static async delete(req, res) {
    const { id } = req.params
    const evalAntro = await prisma.$transaction(async (tx) => {
      const e = await AnthropometricEvalModel.delete(id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ELIMINAR,
          entidad: ENTIDADES.EVAL_ANTROPOMETRICA,
          objetivo_id: e.id,
          paciente_id: e.paciente_id,
        },
        tx
      )
      return e
    })
    res.json(evalAntro)
  }

  static async update(req, res) {
    const { id } = req.params
    const updatedEval = await prisma.$transaction(async (tx) => {
      const e = await AnthropometricEvalModel.update(id, req.body, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.ACTUALIZAR,
          entidad: ENTIDADES.EVAL_ANTROPOMETRICA,
          objetivo_id: e.id,
          paciente_id: e.paciente_id,
        },
        tx
      )
      return e
    })
    res.json(updatedEval)
  }
}
