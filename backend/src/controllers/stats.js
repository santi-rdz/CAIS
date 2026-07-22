import { StatsModel } from '#models/StatsModel.js'
import { ROLES } from '@cais/shared/constants/users'
import { STATS_RANGES, DEFAULT_STATS_RANGE } from '@cais/shared/constants/stats'
import { ForbiddenError } from '#lib/appError.js'

const VALID_RANGES = Object.values(STATS_RANGES)

export class StatsController {
  static async getStats(req, res) {
    const { area, userId, role } = req.session

    // Pasante → stats personales; admin → globales de todas las áreas;
    // coordinador → globales de su área. Solo es inválido un no-admin/no-pasante
    // sin área (no debería ocurrir).
    if (role !== ROLES.PASANTE && role !== ROLES.ADMIN && !area) {
      throw new ForbiddenError('Área no definida para este usuario')
    }

    const range = VALID_RANGES.includes(req.query.range) ? req.query.range : DEFAULT_STATS_RANGE

    res.json(await StatsModel.getStats({ area, userId, role, range }))
  }
}
