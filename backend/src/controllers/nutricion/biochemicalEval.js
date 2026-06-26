import { prisma } from '#config/prisma.js'
import { BiochemicalEvalModel } from '#models/nutricion/BiochemicalEval.js'
import { PatientModel } from '#models/PatientModel.js'
import { parsePagination } from '#lib/paginate.js'
import { isUUID } from '@cais/shared/schemas/fields'

const ALLOWED_FIELDS = new Set(['id', 'paciente_id', 'fecha', 'creado_at'])

export class BiochemicalEvalController {
  static async create(req, res) {
    try {
      const evaluation = await prisma.$transaction(async (tx) => {
        const h = await BiochemicalEvalModel.create(req.body, req.session.userId, tx)
        await PatientModel.touch(req.body.paciente_id, tx)
        return h
      })
      return res.status(201).json({ message: 'Evaluación bioquímica registrada', evaluation })
    } catch (error) {
      console.error('Error al crear evaluación bioquímica:', error)
      return res.status(500).json({ message: 'Error al registrar evaluación bioquímica' })
    }
  }

  static async getAll(req, res) {
    const { paciente_id, fields } = req.query
    const { page, limit } = parsePagination(req.query)

    if (paciente_id && !isUUID(paciente_id)) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "paciente_id" debe ser un UUID válido',
      })
    }

    const rawFields = Array.isArray(fields) ? fields.join(',') : fields
    const parsedFields = rawFields
      ? rawFields
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
      : null

    if (parsedFields) {
      const invalid = parsedFields.filter((f) => !ALLOWED_FIELDS.has(f))
      if (invalid.length) {
        return res.status(422).json({
          error: 'ValidationError',
          message: `Campos no permitidos: ${invalid.join(', ')}`,
        })
      }
    }

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
    if (!evaluation) return res.status(404).json({ message: 'Evaluación bioquímica no encontrada' })
    res.json(evaluation)
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const evaluation = await BiochemicalEvalModel.delete(id)
      if (!evaluation)
        return res.status(404).json({ message: 'Evaluación bioquímica no encontrada' })
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
    const { id } = req.params
    try {
      const updatedEval = await prisma.$transaction(async (tx) => {
        const h = await BiochemicalEvalModel.update(id, req.body, req.session.userId, tx)
        if (!h) return null
        await PatientModel.touch(h.paciente_id, tx)
        return h
      })
      if (!updatedEval)
        return res.status(404).json({ message: 'Evaluación bioquímica no encontrada' })
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
