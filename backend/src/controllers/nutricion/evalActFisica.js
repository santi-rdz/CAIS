import { prisma } from '#config/prisma.js'
import { EvalActFisicaModel } from '#models/nutricion/EvalActFisica.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import {
  validateEvalActFisica,
  validatePartialEvalActFisica,
} from '@cais/shared/schemas/nutricion/evalActFisica'
import { formatZodErrors } from '#lib/formatErrors.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'
import { z } from 'zod'

const LISTABLE_FIELDS = new Set(['id', 'historia_paciente_id', 'fecha'])
const uuidSchema = z.uuid()

function parsePositiveIntId(rawId) {
  const n = Number(rawId)
  return Number.isInteger(n) && n > 0 ? n : null
}

export class EvalActFisicaController {
  static async create(req, res) {
    const result = validateEvalActFisica(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de evaluación de actividad física inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const evaluacion = await prisma.$transaction(async (tx) => {
        const e = await EvalActFisicaModel.create(result.data, tx)
        await PatientModel.touch(e.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.CREAR,
            entidad: ENTIDADES.HISTORIA_NUTRICION,
            objetivo_id: null,
            paciente_id: e.paciente_id,
          },
          tx
        )
        return e
      })
      return res
        .status(201)
        .json({ message: 'Evaluación de actividad física registrada', evaluacion })
    } catch (error) {
      console.error('Error al crear evaluación de actividad física:', error)
      return res.status(500).json({ message: 'Error al registrar evaluación de actividad física' })
    }
  }

  static async getAll(req, res) {
    const { historia_paciente_id, fields } = req.query
    const { page, limit } = parsePagination(req.query)

    if (historia_paciente_id !== undefined) {
      const parsed = uuidSchema.safeParse(historia_paciente_id)
      if (!parsed.success) {
        return res.status(422).json({
          error: 'ValidationError',
          message: 'El parámetro "historia_paciente_id" debe ser un UUID válido',
        })
      }
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
      const result = await EvalActFisicaModel.getAll({
        historia_paciente_id,
        page,
        limit,
        fields: parsedFields,
      })
      return res.json(result)
    } catch (err) {
      console.error('Error al obtener evaluaciones de actividad física:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener evaluaciones de actividad física',
      })
    }
  }

  static async getById(req, res) {
    const id = parsePositiveIntId(req.params.id)
    if (id === null) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "id" debe ser un entero positivo',
      })
    }
    try {
      const evaluacion = await EvalActFisicaModel.getById(id)
      if (!evaluacion)
        return res.status(404).json({ message: 'Evaluación de actividad física no encontrada' })
      return res.json(evaluacion)
    } catch (err) {
      console.error('Error al obtener evaluación de actividad física:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener evaluación de actividad física',
      })
    }
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const evaluacion = await prisma.$transaction(async (tx) => {
        const e = await EvalActFisicaModel.delete(id, tx)
        if (!e) return null
        await PatientModel.touch(e.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ELIMINAR,
            entidad: ENTIDADES.HISTORIA_NUTRICION,
            objetivo_id: null,
            paciente_id: e.paciente_id,
          },
          tx
        )
        return e
      })
      if (!evaluacion)
        return res.status(404).json({ message: 'Evaluación de actividad física no encontrada' })
      res.json(evaluacion)
    } catch (err) {
      console.error('Error al eliminar evaluación de actividad física:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar evaluación de actividad física',
      })
    }
  }

  static async update(req, res) {
    const result = validatePartialEvalActFisica(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    const { id } = req.params
    try {
      const updated = await prisma.$transaction(async (tx) => {
        const e = await EvalActFisicaModel.update(id, result.data, tx)
        if (!e) return null
        await PatientModel.touch(e.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ACTUALIZAR,
            entidad: ENTIDADES.HISTORIA_NUTRICION,
            objetivo_id: null,
            paciente_id: e.paciente_id,
          },
          tx
        )
        return e
      })
      if (!updated)
        return res.status(404).json({ message: 'Evaluación de actividad física no encontrada' })
      res.json(updated)
    } catch (err) {
      console.error('Error al actualizar evaluación de actividad física:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar evaluación de actividad física',
      })
    }
  }
}
