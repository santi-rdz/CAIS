import { DashboardModel } from '#models/DashboardModel.js'

export class DashboardController {
  static async getStats(req, res) {
    try {
      const area = req.session.area
      if (!area) {
        return res
          .status(403)
          .json({ error: 'Forbidden', message: 'Área no definida para este usuario' })
      }

      const stats = await DashboardModel.getStats(area)
      res.json(stats)
    } catch (err) {
      console.error('Error al obtener estadísticas del dashboard:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener estadísticas',
      })
    }
  }
}
