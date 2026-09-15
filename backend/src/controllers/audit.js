import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ROLES } from '@cais/shared/constants/users'
import { ForbiddenError } from '#lib/appError.js'

export class AuditController {
  static async getAll(req, res) {
    const { role, userId } = req.session
    const isPrivileged = role === ROLES.COORDINADOR || role === ROLES.ADMIN
    const { usuario_id, accion, entidad, paciente_id } = req.query
    const { page, limit } = parsePagination(req.query)

    if (!isPrivileged && usuario_id !== userId) {
      throw new ForbiddenError('Solo puedes ver tu propia actividad')
    }

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
    res.json(record)
  }
}
