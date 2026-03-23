import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'

export class AuditController {
  static async getAll(req, res) {
    const { usuario_id, accion, entidad } = req.query
    const { page, limit } = parsePagination(req.query)

    const result = await AuditModel.getAll({
      usuario_id,
      accion,
      entidad,
      page,
      limit,
    })
    res.json(result)
  }
}
