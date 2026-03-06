import { InvitationModel } from '../models/InvitationModel.js'
import { UserService } from '../services/users.js'
import { validateInvitedUser } from '../schemas/invitedUser.js'
import { formatZodErrors } from '../lib/formatErrors.js'

export class InvitationController {
  static async create(req, res) {
    const result = validateInvitedUser(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de invitación inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const creadoPor = req.headers['x-user-id'] || null
      const response = await UserService.preRegister(result.data, creadoPor)
      res.status(201).json(response)
    } catch (err) {
      if (err.code === 'P2002') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Uno o más correos ya tienen una invitación pendiente',
        })
      }
      console.error('Error en preRegister:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al crear invitaciones',
      })
    }
  }

  static async validateToken(req, res) {
    const { token } = req.params

    try {
      const invitacion = await InvitationModel.findByToken(token)

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
      res
        .status(500)
        .json({ error: 'InternalError', message: 'Error al validar token' })
    }
  }
}
