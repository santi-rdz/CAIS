import { bufferToUUID, uuidToBuffer } from '#lib/uuid.js'
import { sendEmail } from '#lib/sendEmail.js'
import { passwordResetEmail } from '#lib/passwordResetEmail.js'
import { AuthModel } from '#models/AuthModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { prisma } from '#config/prisma.js'
import { serverConfig } from '#config/env.js'
import { validatePasswordReset, validateChangePassword } from '@cais/shared/schemas/password'
import { correoSchema } from '@cais/shared/schemas/fields'
import { ESTADOS, ACCIONES, ENTIDADES } from '@cais/shared/constants/users'
import { formatZodErrors } from '#lib/formatErrors.js'
import { BCRYPT_ROUNDS, PASSWORD_RESET_TTL_MS } from '#lib/constants.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

function formatUser(user) {
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

    try {
      if (!email) return res.status(400).json({ error: 'Correo requerido' })
      if (!password) return res.status(400).json({ error: 'Contraseña requerida' })

      const user = await AuthModel.findByEmail(email)

      // Mensaje único para no permitir enumeración de cuentas.
      const invalidCredentials = { error: 'Correo o contraseña inválidos' }

      if (!user || !user.password_hash) {
        return res.status(401).json(invalidCredentials)
      }

      const isMatch = await bcrypt.compare(password, user.password_hash)
      if (!isMatch) {
        return res.status(401).json(invalidCredentials)
      }

      if (user.estados?.codigo !== ESTADOS.ACTIVO) {
        return res.status(403).json({ error: 'Cuenta desactivada' })
      }

      req.session.regenerate((err) => {
        if (err) return res.status(500).json({ error: 'Server error' })
        req.session.userId = bufferToUUID(user.id)
        req.session.role = user.roles?.codigo
        req.session.areaId = user.area_id ?? null
        req.session.area = user.areas?.nombre ?? null
        prisma.usuarios
          .update({
            where: { id: user.id },
            data: { ultimo_acceso: new Date() },
          })
          .catch((e) => console.error('Error actualizando ultimo_acceso:', e))
        AuditModel.create({
          usuario_id: req.session.userId,
          accion: ACCIONES.INICIAR_SESION,
          entidad: ENTIDADES.USUARIO,
        }).catch((e) => console.error('Error registrando audit de login:', e))
        return res.json({ ok: true })
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error en el servidor' })
    }
  }

  static async me(req, res) {
    try {
      const user = await prisma.usuarios.findUnique({
        where: { id: uuidToBuffer(req.session.userId) },
        select: {
          id: true,
          nombre: true,
          correo: true,
          foto: true,
          roles: { select: { codigo: true } },
          areas: { select: { nombre: true } },
        },
      })
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
      return res.json(formatUser(user))
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error en servidor' })
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.error('Error al destruir sesión:', err)
      res.clearCookie('connect.sid')
      return res.json({ ok: true })
    })
  }

  // ─── Flujo: cambiar contraseña desde configuración ──────────────────────────
  // PATCH /auth/password  (requiere sesión activa)
  // Body: { currentPassword, password, confirmPassword }

  static async changePassword(req, res) {
    try {
      const validation = validateChangePassword(req.body)
      if (!validation.success) {
        return res.status(422).json({
          error: 'Datos inválidos',
          details: formatZodErrors(validation.error),
        })
      }

      const { currentPassword, password: newPassword } = validation.data

      const user = await prisma.usuarios.findUnique({
        where: { id: uuidToBuffer(req.session.userId) },
        select: { id: true, password_hash: true },
      })

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      if (!user.password_hash) {
        return res.status(400).json({ error: 'La contraseña actual es incorrecta' })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password_hash)
      if (!isMatch) {
        return res.status(400).json({ error: 'La contraseña actual es incorrecta' })
      }

      const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
      await AuthModel.updatePassword(user.id, passwordHash)
      await AuthModel.deleteResetTokensByUser(user.id)

      const userId = bufferToUUID(user.id)
      const role = req.session.role
      const areaId = req.session.areaId
      const area = req.session.area

      req.session.regenerate((err) => {
        if (err) {
          console.error('Error regenerando sesión tras cambio de contraseña:', err)
          return res.status(500).json({ error: 'Error del servidor' })
        }
        req.session.userId = userId
        req.session.role = role
        req.session.areaId = areaId
        req.session.area = area
        return res.json({ message: 'Contraseña actualizada exitosamente' })
      })
    } catch (err) {
      console.error('Error cambiando contraseña:', err)
      return res.status(500).json({ error: 'Error del servidor' })
    }
  }

  // ─── Flujo: olvidé mi contraseña ────────────────────────────────────────────
  // POST /auth/password/forgot
  // Body: { correo }

  static async requestPasswordReset(req, res) {
    try {
      const correoResult = correoSchema.safeParse(req.body.correo)
      if (!correoResult.success) {
        return res.status(422).json({
          error: correoResult.error.issues[0]?.message ?? 'Correo inválido',
        })
      }

      const correo = correoResult.data
      const user = await AuthModel.findByEmail(correo)

      // Siempre responder igual para evitar enumeración de correos
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

      return res.json(okResponse)
    } catch (err) {
      console.error('Error solicitando reset de contraseña:', err)
      return res.status(500).json({ error: 'Error del servidor' })
    }
  }

  // ─── Flujo: confirmar reset con token del correo ─────────────────────────────
  // POST /auth/password/reset
  // Body: { token, password, confirmPassword }

  static async confirmPasswordReset(req, res) {
    try {
      const validation = validatePasswordReset(req.body)
      if (!validation.success) {
        return res.status(422).json({
          error: 'Datos inválidos',
          details: formatZodErrors(validation.error),
        })
      }

      const { token, password } = validation.data
      const resetToken = await AuthModel.findResetToken(token)

      if (!resetToken) {
        return res.status(400).json({ error: 'Token inválido' })
      }

      if (resetToken.usado) {
        return res.status(400).json({ error: 'Token ya utilizado' })
      }

      if (resetToken.expira_at < new Date()) {
        await AuthModel.deleteResetToken(token)
        return res.status(400).json({ error: 'Token expirado' })
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)

      try {
        await AuthModel.consumeResetToken(resetToken.token, resetToken.usuario_id, passwordHash)
      } catch {
        return res.status(400).json({ error: 'Token inválido, expirado o ya utilizado' })
      }

      if (req.session?.userId) {
        req.session.destroy((err) => {
          if (err) console.error('Error destruyendo sesión tras reset de contraseña:', err)
          return res.json({ message: 'Contraseña actualizada exitosamente' })
        })
      } else {
        return res.json({ message: 'Contraseña actualizada exitosamente' })
      }
    } catch (err) {
      console.error('Error confirmando reset de contraseña:', err)
      return res.status(500).json({ error: 'Error del servidor' })
    }
  }
}
