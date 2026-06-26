import { prisma } from '#config/prisma.js'
import { NutritionalEvalModel } from '#models/nutricion/NutritionalEval.js'
import { parsePagination } from '#lib/paginate.js'

export class NutritionalEvalController {
  static async create(req, res) {
    try {
      const evaluation = await prisma.$transaction(async (tx) => {
        const h = await NutritionalEvalModel.create(req.body, tx)
        return h
      })
      return res.status(201).json({ message: 'Evaluación nutricional registrada', evaluation })
    } catch (error) {
      console.error('Error al crear evaluación nutricional:', error)
      return res.status(500).json({ message: 'Error al registrar evaluación nutricional' })
    }
  }

  static async getAll(req, res) {
    try {
      const { paciente_id, fields } = req.query
      const { page, limit } = parsePagination(req.query)

      const parsedFields = fields
        ? fields
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean)
        : null

      const result = await NutritionalEvalModel.getAll({
        paciente_id,
        page,
        limit,
        fields: parsedFields,
      })
      return res.json(result)
    } catch (err) {
      console.error('Error al consultar evaluaciones nutricionales:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al consultar evaluaciones nutricionales',
      })
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params
      const evaluation = await NutritionalEvalModel.getById(id)
      if (!evaluation)
        return res.status(404).json({ message: 'Evaluación nutricional no encontrada' })
      return res.json(evaluation)
    } catch (err) {
      console.error('Error al obtener evaluación nutricional:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener evaluación nutricional',
      })
    }
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const evaluation = await NutritionalEvalModel.delete(id)
      if (!evaluation)
        return res.status(404).json({ message: 'Evaluación nutricional no encontrada' })
      res.json(evaluation)
    } catch (err) {
      console.error('Error al eliminar evaluación nutricional:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar evaluación nutricional',
      })
    }
  }

  static async update(req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Se requiere al menos un campo para actualizar',
      })
    }

    const { id } = req.params
    try {
      const updatedEvaluation = await prisma.$transaction(async (tx) => {
        const h = await NutritionalEvalModel.update(id, req.body, tx)
        if (!h) return null
        return h
      })
      if (!updatedEvaluation)
        return res.status(404).json({ message: 'Evaluación nutricional no encontrada' })
      res.json({ evaluation: updatedEvaluation })
    } catch (err) {
      console.error('Error al actualizar evaluación nutricional:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar evaluación nutricional',
      })
    }
  }
}
