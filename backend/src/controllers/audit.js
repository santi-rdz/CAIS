import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'

export class AuditController {
  static async getAll(req, res) {
    const { usuario_id, accion, entidad, paciente_id } = req.query
    const { page, limit } = parsePagination(req.query)

    const result = await AuditModel.getAll({
      usuario_id,
      accion,
      entidad,
      paciente_id,
      page,
      limit,
    })
    res.json(result)
  }
  static async getById(req, res) {
    const record = await AuditModel.getById(req.params.id)
    if (!record) return res.status(404).json({ message: 'Registro de auditoría no encontrado' })
    res.json(record)
  }
}
