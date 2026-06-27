import { prisma } from '#config/prisma.js'
import { NutritionalEvalModel } from '#models/nutricion/NutritionalEval.js'
import { parsePagination } from '#lib/paginate.js'

const LISTABLE_FIELDS = new Set(['id', 'paciente_id', 'fecha', 'creado_at'])

export class NutritionalEvalController {
  static async create(req, res) {
    const evaluation = await prisma.$transaction(async (tx) => {
      const h = await NutritionalEvalModel.create(req.body, tx)
      return h
    })
    return res.status(201).json({ message: 'Evaluación nutricional registrada', evaluation })
  }

  static async getAll(req, res) {
    const { paciente_id, fields } = req.query
    const { page, limit } = parsePagination(req.query)

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

    const result = await NutritionalEvalModel.getAll({
      paciente_id,
      page,
      limit,
      fields: parsedFields,
    })
    return res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const evaluation = await NutritionalEvalModel.getById(id)
    if (!evaluation)
      return res.status(404).json({ message: 'Evaluación nutricional no encontrada' })
    return res.json(evaluation)
  }

  static async delete(req, res) {
    const { id } = req.params
    const evaluation = await NutritionalEvalModel.delete(id)
    if (!evaluation)
      return res.status(404).json({ message: 'Evaluación nutricional no encontrada' })
    res.json(evaluation)
  }

  static async update(req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Se requiere al menos un campo para actualizar',
      })
    }

    const { id } = req.params
    const updatedEvaluation = await prisma.$transaction(async (tx) => {
      const h = await NutritionalEvalModel.update(id, req.body, tx)
      if (!h) return null
      return h
    })
    if (!updatedEvaluation)
      return res.status(404).json({ message: 'Evaluación nutricional no encontrada' })
    res.json({ evaluation: updatedEvaluation })
  }
}
