import { EvolutionNoteModel } from '#models/medicina/EvolutionNote.js'
import { PatientModel } from '#models/PatientModel.js'
import { parsePagination } from '#lib/paginate.js'
import { prisma } from '#config/prisma.js'
import { AuditModel } from '#models/AuditModel.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

export class EvolutionNoteController {
  static async create(req, res) {
    const note = await prisma.$transaction(async (tx) => {
      const n = await EvolutionNoteModel.create(req.body, req.session.userId, tx)
      await PatientModel.touch(n.paciente_id, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.NOTA_EVOLUCION,
          objetivo_id: n.id,
          paciente_id: n.paciente_id,
        },
        tx
      )
      return n
    })
    return res.status(201).json({ message: 'Nota de evolución registrada', note })
  }

  static async getAll(req, res) {
    const { historia_medica_id } = req.query
    const { page, limit } = parsePagination(req.query)

    const result = await EvolutionNoteModel.getAll({
      historia_medica_id,
      page,
      limit,
    })
    res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const note = await EvolutionNoteModel.getById(id)
    res.json(note)
  }

  static async delete(req, res) {
    const { id } = req.params
    const note = await prisma.$transaction(async (tx) => {
      const n = await EvolutionNoteModel.delete(id, tx)
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
    res.json(note)
  }

  static async update(req, res) {
    const { id } = req.params
    const updatedNote = await prisma.$transaction(async (tx) => {
      const n = await EvolutionNoteModel.update(id, req.body, req.session.userId, tx)
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
    res.json(updatedNote)
  }
}
