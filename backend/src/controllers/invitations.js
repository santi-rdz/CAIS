import { InvitationModel } from '#models/InvitationModel.js'
import { UserService } from '#services/users.js'

export class InvitationController {
  static async create(req, res) {
    // Los conflictos (correo ya registrado / invitación pendiente) los lanza
    // UserService como EmailConflictError → 409 vía el error middleware.
    const creadoPor = req.session.userId || null
    const response = await UserService.preRegister(req.body, creadoPor)
    res.status(201).json(response)
  }

  static async remove(req, res) {
    const { correo } = req.body
    if (!correo) {
      return res.status(422).json({ error: 'ValidationError', message: 'correo es requerido' })
    }

    const deleted = await InvitationModel.deleteByCorreo(correo)
    if (!deleted) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'No existe invitación pendiente para este correo',
      })
    }
    res.json({ message: 'Invitación eliminada exitosamente' })
  }

  static async resend(req, res) {
    const { correo } = req.body
    if (!correo) {
      return res.status(422).json({ error: 'ValidationError', message: 'correo es requerido' })
    }

    const result = await UserService.resendInvitation(correo)
    if (!result) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'No existe invitación pendiente para este correo',
      })
    }
    res.json({ message: 'Invitación reenviada exitosamente' })
  }

  static async validateToken(req, res) {
    const invitacion = await InvitationModel.findByToken(req.params.token)
    if (!invitacion) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'El token es inválido, ha expirado o ya fue utilizado',
      })
    }

    res.json({ correo: invitacion.correo, rol: invitacion.rol })
  }
}
