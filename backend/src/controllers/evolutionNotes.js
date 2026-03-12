import { EvolutionNoteModel } from '../models/EvolutionNote.js'
import {
  validateEvolutionNote,
  validatePartialEvolutionNote,
} from '../schemas/evolutionNote.js'
import { formatZodErrors } from '../lib/formatErrors.js'

export class EvolutionNoteController {
  /**
   * POST /notas-evolucion
   * Registrar una nota de evolución.
   */
  static async create(req, res) {
    const validation = validateEvolutionNote(req.body)
    if (!validation.success) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(validation.error),
        message: 'Datos de nota de evolución inválidos',
      })
    }

    try {
      const note = await EvolutionNoteModel.create(validation.data)
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

  /**
   * GET /notas-evolucion
   * Listar notas de evolución con paginación opcional y filtro por paciente.
   */
  static async getAll(req, res) {
    const { paciente_id } = req.query
    const page = +req.query.page || 1
    const limit = +req.query.limit || 10

    const result = await EvolutionNoteModel.getAll({ paciente_id, page, limit })
    res.json(result)
  }

  /**
   * GET /notas-evolucion/:id
   * Obtiene los detalles de una nota de evolución por ID.
   */
  static async getById(req, res) {
    const { id } = req.params
    const note = await EvolutionNoteModel.getById(id)
    if (!note)
      return res
        .status(404)
        .json({ message: 'Nota de evolución no encontrada' })
    res.json(note)
  }

  /**
   * DELETE /notas-evolucion/:id
   * Eliminar una nota de evolución.
   */
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

  /**
   * PATCH /notas-evolucion/:id
   * Actualizar parcialmente una nota de evolución.
   */
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
      const updatedNote = await EvolutionNoteModel.update(id, result.data)
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
