import { prisma } from '#config/prisma.js'
import { TpanNutritionModel } from '#models/nutricion/TpanNutrition.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { isUUID } from '@cais/shared/schemas/fields'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

const LISTABLE_FIELDS = new Set(['id', 'paciente_id', 'fecha_eval'])

export class TpanNutritionController {
  static async create(req, res) {
    try {
      const tpan = await prisma.$transaction(async (tx) => {
        const t = await TpanNutritionModel.create(req.body, tx)
        await PatientModel.touch(req.body.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.CREAR,
            entidad: ENTIDADES.TPAN,
            objetivo_id: null,
            paciente_id: t.paciente_id,
          },
          tx
        )
        return t
      })
      return res.status(201).json({ message: 'TPAN registrado', tpan })
    } catch (error) {
      console.error('Error al crear TPAN:', error)
      return res.status(500).json({ message: 'Error al registrar TPAN' })
    }
  }

  static async getAll(req, res) {
    const { paciente_id, fields } = req.query
    const { page, limit } = parsePagination(req.query)

    if (paciente_id !== undefined && !isUUID(paciente_id)) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "paciente_id" debe ser un UUID válido',
      })
    }

    if (fields !== undefined && typeof fields !== 'string') {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "fields" debe ser una cadena separada por comas',
      })
    }

    const parsedFields = fields
      ? fields
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
      : null

    if (parsedFields && parsedFields.some((field) => !LISTABLE_FIELDS.has(field))) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "fields" contiene valores no permitidos',
      })
    }

    try {
      const result = await TpanNutritionModel.getAll({
        paciente_id,
        page,
        limit,
        fields: parsedFields,
      })
      return res.json(result)
    } catch (err) {
      console.error('Error al obtener TPANs:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener TPANs',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params
    try {
      const tpan = await TpanNutritionModel.getById(id)
      if (!tpan) return res.status(404).json({ message: 'TPAN no encontrado' })
      return res.json(tpan)
    } catch (err) {
      console.error('Error al obtener TPAN:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener TPAN',
      })
    }
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const tpan = await prisma.$transaction(async (tx) => {
        const t = await TpanNutritionModel.delete(id, tx)
        if (!t) return null
        await PatientModel.touch(t.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ELIMINAR,
            entidad: ENTIDADES.TPAN,
            objetivo_id: null,
            paciente_id: t.paciente_id,
          },
          tx
        )
        return t
      })
      if (!tpan) return res.status(404).json({ message: 'TPAN no encontrado' })
      res.json(tpan)
    } catch (err) {
      console.error('Error al eliminar TPAN:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar TPAN',
      })
    }
  }

  static async update(req, res) {
    const { id } = req.params
    try {
      const updatedTpan = await prisma.$transaction(async (tx) => {
        const t = await TpanNutritionModel.update(id, req.body, tx)
        if (!t) return null
        await PatientModel.touch(t.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ACTUALIZAR,
            entidad: ENTIDADES.TPAN,
            objetivo_id: null,
            paciente_id: t.paciente_id,
          },
          tx
        )
        return t
      })
      if (!updatedTpan) return res.status(404).json({ message: 'TPAN no encontrado' })
      res.json(updatedTpan)
    } catch (err) {
      console.error('Error al actualizar TPAN:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar TPAN',
      })
    }
  }
}
