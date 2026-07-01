import { bufferToUUID } from '#lib/uuid.js'
import { sendEmail } from '#lib/sendEmail.js'
import { passwordResetEmail } from '#lib/passwordResetEmail.js'
import { AuthModel } from '#models/AuthModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { serverConfig } from '#config/env.js'
import { ESTADOS, ACCIONES, ENTIDADES } from '@cais/shared/constants/users'
import { BCRYPT_ROUNDS, PASSWORD_RESET_TTL_MS } from '#lib/constants.js'
import { regenerateSession, destroySession } from '#lib/session.js'
import { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError } from '#lib/appError.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

function formatSessionUser(user) {
  return {
    id: bufferToUUID(user.id),
    nombre: user.nombre,
    correo: user.correo,
    foto: user.foto,
    rol: user.roles?.codigo,
    area: user.areas?.nombre,
  }
}

export class AuthController {
  static async login(req, res) {
    const { email, password } = req.body

    const user = await AuthModel.findByEmail(email)

    // Mensaje único para no permitir enumeración de cuentas.
    const invalidCredentials = 'Correo o contraseña inválidos'

    if (!user?.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedError(invalidCredentials)
    }

    if (user.estados?.codigo !== ESTADOS.ACTIVO) {
      throw new ForbiddenError('Cuenta desactivada')
    }

    await regenerateSession(req.session)
    req.session.userId = bufferToUUID(user.id)
    req.session.role = user.roles?.codigo
    req.session.areaId = user.area_id ?? null
    req.session.area = user.areas?.nombre ?? null

    await AuthModel.touchLastAccess(req.session.userId)
    await AuditModel.create({
      usuario_id: req.session.userId,
      accion: ACCIONES.INICIAR_SESION,
      entidad: ENTIDADES.USUARIO,
    })

    res.json({ ok: true })
  }

  static async me(req, res) {
    const user = await AuthModel.findSessionUser(req.session.userId)
    if (!user) throw new NotFoundError('el usuario')
    res.json(formatSessionUser(user))
  }

  static async logout(req, res) {
    await destroySession(req.session)
    res.clearCookie('connect.sid')
    res.json({ ok: true })
  }

  // ─── Flujo: cambiar contraseña desde configuración ──────────────────────────
  // PATCH /auth/password  (requiere sesión activa)
  // Body: { currentPassword, password, confirmPassword }

  static async changePassword(req, res) {
    const { currentPassword, password: newPassword } = req.body

    const user = await AuthModel.findByIdWithHash(req.session.userId)
    if (!user) throw new NotFoundError('el usuario')

    if (!user.password_hash || !(await bcrypt.compare(currentPassword, user.password_hash))) {
      throw new BadRequestError('La contraseña actual es incorrecta')
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
    await AuthModel.updatePassword(user.id, passwordHash)
    await AuthModel.deleteResetTokensByUser(user.id)

    const { role, areaId, area } = req.session
    const userId = bufferToUUID(user.id)

    await regenerateSession(req.session)
    req.session.userId = userId
    req.session.role = role
    req.session.areaId = areaId
    req.session.area = area

    res.json({ message: 'Contraseña actualizada exitosamente' })
  }

  // ─── Flujo: olvidé mi contraseña ────────────────────────────────────────────
  // POST /auth/password/forgot
  // Body: { correo }

  static async requestPasswordReset(req, res) {
    const { correo } = req.body
    const user = await AuthModel.findByEmail(correo)

    // Siempre responder igual para evitar enumeración de correos.
    const okResponse = {
      message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña',
    }

    if (!user) return res.json(okResponse)

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS)
    await AuthModel.createResetToken(user.id, token, expiresAt)

    const resetUrl = `${serverConfig.frontendUrl}/restablecer-contrasena/${token}`
    sendEmail({
      to: user.correo,
      subject: 'Restablecer contraseña - CAIS',
      html: passwordResetEmail(user.nombre, resetUrl),
    }).catch((err) => {
      console.error('⚠️ No se pudo enviar correo de reset:', err.message)
    })

    res.json(okResponse)
  }

  // ─── Flujo: confirmar reset con token del correo ─────────────────────────────
  // POST /auth/password/reset
  // Body: { token, password, confirmPassword }

  static async confirmPasswordReset(req, res) {
    const { token, password } = req.body

    const resetToken = await AuthModel.findResetToken(token)
    if (!resetToken) throw new BadRequestError('Token inválido')
    if (resetToken.usado) throw new BadRequestError('Token ya utilizado')

    if (resetToken.expira_at < new Date()) {
      await AuthModel.deleteResetToken(token)
      throw new BadRequestError('Token expirado')
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    // Lanza BadRequestError si el token corrió una carrera y ya no es consumible.
    await AuthModel.consumeResetToken(resetToken.token, resetToken.usuario_id, passwordHash)

    if (req.session?.userId) await destroySession(req.session)
    res.json({ message: 'Contraseña actualizada exitosamente' })
  }
}
