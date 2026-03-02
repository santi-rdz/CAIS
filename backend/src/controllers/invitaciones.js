import { InvitacionModel } from '../models/TokenModel.js'
import { UserService } from '../services/users.js'
import { validateInvitedUser } from '../schemas/invitedUser.js'

export class InvitacionController {
  /**
   * POST /invitaciones
   * Crea invitaciones de registro y envía correos a los usuarios invitados.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async create(req, res) {
    const result = validateInvitedUser(req.body)
    if (result.error) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Datos de invitación inválidos',
        details: JSON.parse(result.error.message),
      })
    }

    try {
      // TODO: obtener creadoPor del token de sesión (auth middleware)
      const creadoPor = req.headers['x-user-id'] || null
      const response = await UserService.preRegister(result.data, creadoPor)
      res.status(201).json(response)
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Uno o más correos ya tienen una invitación pendiente',
        })
      }
      console.error('Error en preRegister:', err)
      res.status(500).json({ error: 'InternalError', message: 'Error al crear invitaciones' })
    }
  }

  /**
   * GET /invitaciones/:token
   * Valida un token de registro y retorna el correo y rol asociados si es válido.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async validateToken(req, res) {
    const { token } = req.params

    try {
      const invitacion = await InvitacionModel.findByToken(token)

      if (!invitacion) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'El token es inválido, ha expirado o ya fue utilizado',
        })
      }

      res.json({
        correo: invitacion.correo,
        rol: invitacion.rol,
      })
    } catch (err) {
      console.error('Error validando token:', err)
      res.status(500).json({ error: 'InternalError', message: 'Error al validar token' })
    }
  }
}
