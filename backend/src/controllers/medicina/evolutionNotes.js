import { EvolutionNoteModel } from '#models/medicina/EvolutionNote.js'
import {
  validateEvolutionNote,
  validatePartialEvolutionNote,
} from '@cais/shared/schemas/medicina/evolutionNote'
import { formatZodErrors } from '#lib/formatErrors.js'
import { parsePagination } from '#lib/paginate.js'

export class EvolutionNoteController {
  static async create(req, res) {
    const result = validateEvolutionNote(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de nota de evolución inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const note = await EvolutionNoteModel.create(
        result.data,
        req.session.userId
      )
      return res
        .status(201)
        .json({ message: 'Nota de evolución registrada', note })
    } catch (error) {
      console.error('Error creating evolution note:', error)
      return res
        .status(500)
        .json({ error: 'Error al registrar nota de evolución' })
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

    const result = await EvolutionNoteModel.getAll({
      paciente_id,
      page,
      limit,
      fields: parsedFields,
    })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const note = await EvolutionNoteModel.getById(id)
    if (!note)
      return res
        .status(404)
        .json({ message: 'Nota de evolución no encontrada' })
    res.json(note)
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const note = await EvolutionNoteModel.delete(id)
      if (!note)
        return res
          .status(404)
          .json({ message: 'Nota de evolución no encontrada' })
      res.json(note)
    } catch (err) {
      console.error('Error al eliminar nota de evolución:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar nota de evolución',
      })
    }
  }

  static async update(req, res) {
    const result = validatePartialEvolutionNote(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    const { id } = req.params
    try {
      const updatedNote = await EvolutionNoteModel.update(
        id,
        result.data,
        req.session.userId
      )
      if (!updatedNote)
        return res
          .status(404)
          .json({ message: 'Nota de evolución no encontrada' })
      res.json(updatedNote)
    } catch (err) {
      console.error('Error al actualizar nota de evolución:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar nota de evolución',
      })
    }
  }
}
