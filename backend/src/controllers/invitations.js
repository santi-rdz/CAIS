import { InvitationModel } from '#models/InvitationModel.js'
import { UserService } from '#services/users.js'
import { validateInvitedUser } from '@cais/shared/schemas/invitations'
import { formatZodErrors } from '#lib/formatErrors.js'

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
      const creadoPor = req.session.userId || null
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

  static async remove(req, res) {
    const { correo } = req.body

    if (!correo) {
      return res
        .status(422)
        .json({ error: 'ValidationError', message: 'correo es requerido' })
    }

    try {
      const deleted = await InvitationModel.deleteByCorreo(correo)
      if (!deleted) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'No existe invitación pendiente para este correo',
        })
      }
      res.json({ message: 'Invitación eliminada exitosamente' })
    } catch (err) {
      console.error('Error al eliminar invitación:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar invitación',
      })
    }
  }

  static async resend(req, res) {
    const { correo } = req.body

    if (!correo) {
      return res
        .status(422)
        .json({ error: 'ValidationError', message: 'correo es requerido' })
    }

    try {
      const result = await UserService.resendInvitation(correo)
      if (!result) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'No existe invitación pendiente para este correo',
        })
      }
      res.json({ message: 'Invitación reenviada exitosamente' })
    } catch (err) {
      console.error('Error al reenviar invitación:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al reenviar invitación',
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
