import { prisma } from '#config/prisma.js'
import { BiochemicalEvalModel } from '#models/nutricion/BiochemicalEval.js'
import { PatientModel } from '#models/PatientModel.js'
import {
  validateEvalBioqNutricion,
  validatePartialEvalBioqNutricion,
} from '@cais/shared/schemas/nutricion/biochemicalEval'
import { formatZodErrors } from '#lib/formatErrors.js'
import { parsePagination } from '#lib/paginate.js'

export class BiochemicalEvalController {
  static async create(req, res) {
    const result = validateEvalBioqNutricion(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de evaluación bioquímica inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const evaluation = await prisma.$transaction(async (tx) => {
        const h = await BiochemicalEvalModel.create(
          result.data,
          req.session.userId,
          tx
        )
        await PatientModel.touch(result.data.paciente_id, tx)
        return h
      })
      return res
        .status(201)
        .json({ message: 'Evaluación bioquímica registrada', evaluation })
    } catch (error) {
      console.error('Error al crear evaluación bioquímica:', error)
      return res
        .status(500)
        .json({ message: 'Error al registrar evaluación bioquímica' })
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

    const result = await BiochemicalEvalModel.getAll({
      paciente_id,
      page,
      limit,
      fields: parsedFields,
    })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const evaluation = await BiochemicalEvalModel.getById(id)
    if (!evaluation)
      return res
        .status(404)
        .json({ message: 'Evaluación bioquímica no encontrada' })
    res.json(evaluation)
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const evaluation = await BiochemicalEvalModel.delete(id)
      if (!evaluation)
        return res
          .status(404)
          .json({ message: 'Evaluación bioquímica no encontrada' })
      res.json(evaluation)
    } catch (err) {
      console.error('Error al eliminar evaluación bioquímica:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar evaluación bioquímica',
      })
    }
  }

  static async update(req, res) {
    const result = validatePartialEvalBioqNutricion(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    const { id } = req.params
    try {
      const updatedEval = await prisma.$transaction(async (tx) => {
        const h = await BiochemicalEvalModel.update(
          id,
          result.data,
          req.session.userId,
          tx
        )
        if (!h) return null
        await PatientModel.touch(h.paciente_id, tx)
        return h
      })
      if (!updatedEval)
        return res
          .status(404)
          .json({ message: 'Evaluación bioquímica no encontrada' })
      res.json(updatedEval)
    } catch (err) {
      console.error('Error al actualizar evaluación bioquímica:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar evaluación bioquímica',
      })
    }
  }
}
