import { EvolutionNoteModel } from '#models/medicina/EvolutionNote.js'
import { PatientModel } from '#models/PatientModel.js'
import { parsePagination } from '#lib/paginate.js'
import { prisma } from '#config/prisma.js'
import { AuditModel } from '#models/AuditModel.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

export class EvolutionNoteController {
  static async create(req, res) {
    try {
      const note = await prisma.$transaction(async (tx) => {
        const n = await EvolutionNoteModel.create(req.body, req.session.userId, tx)
        await PatientModel.touch(req.body.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.CREAR,
            entidad: ENTIDADES.NOTA_EVOLUCION,
            objetivo_id: n.id,
            paciente_id: req.body.paciente_id,
          },
          tx
        )
        return n
      })
      return res.status(201).json({ message: 'Nota de evolución registrada', note })
    } catch (error) {
      console.error('Error creating evolution note:', error)
      return res.status(500).json({ error: 'Error al registrar nota de evolución' })
    }
  }

  static async getAll(req, res) {
    const { paciente_id, historia_medica_id } = req.query
    const { page, limit } = parsePagination(req.query)

    const result = await EvolutionNoteModel.getAll({
      paciente_id,
      historia_medica_id,
      page,
      limit,
    })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const note = await EvolutionNoteModel.getById(id)
    if (!note) return res.status(404).json({ message: 'Nota de evolución no encontrada' })
    res.json(note)
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const note = await prisma.$transaction(async (tx) => {
        const n = await EvolutionNoteModel.delete(id, tx)
        if (!n) return null
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ELIMINAR,
            entidad: ENTIDADES.NOTA_EVOLUCION,
            objetivo_id: n.id,
            paciente_id: n.paciente_id,
          },
          tx
        )
        return n
      })
      if (!note) return res.status(404).json({ message: 'Nota de evolución no encontrada' })
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
    const { id } = req.params
    try {
      const updatedNote = await prisma.$transaction(async (tx) => {
        const n = await EvolutionNoteModel.update(id, req.body, req.session.userId, tx)
        if (!n) return null
        await PatientModel.touch(n.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ACTUALIZAR,
            entidad: ENTIDADES.NOTA_EVOLUCION,
            objetivo_id: n.id,
            paciente_id: n.paciente_id,
          },
          tx
        )
        return n
      })
      if (!updatedNote) return res.status(404).json({ message: 'Nota de evolución no encontrada' })
      res.json(updatedNote)
    } catch {
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar nota de evolución',
      })
    }
  }
}
