import { prisma } from '#config/prisma.js'
import { bufferToUUID, uuidToBuffer } from '#lib/uuid.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendEmail } from '#lib/sendEmail.js'
import { passwordResetEmail } from '#lib/passwordResetEmail.js'
import {
  validatePasswordResetRequest,
  validatePasswordReset,
} from '@cais/shared/schemas/users'

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
      if (!email) {
        return res.status(400).json({ error: 'Correo requerido' })
      }
      if (!password) {
        return res.status(400).json({ error: 'Contraseña requerida' })
      }

      const user = await prisma.usuarios.findUnique({
        where: { correo: email },
        select: {
          id: true,
          correo: true,
          password_hash: true,
          roles: { select: { codigo: true } },
        },
      })

      if (!user) {
        return res
          .status(401)
          .json({ error: 'Correo electronico no encontrado' })
      }

      const isMatch = await bcrypt.compare(password, user.password_hash)
      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña invalida' })
      }

      req.session.regenerate((err) => {
        if (err) return res.status(500).json({ error: 'Server error' })
        req.session.userId = bufferToUUID(user.id)
        req.session.role = user.roles?.codigo
        prisma.usuarios
          .update({
            where: { id: user.id },
            data: { ultimo_acceso: new Date() },
          })
          .catch((e) => console.error('Error actualizando ultimo_acceso:', e))
        return res.json({ ok: true })
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Server error' })
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
      return res.status(500).json({ error: 'Server error' })
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.error('Error al destruir sesión:', err)
      res.clearCookie('connect.sid')
      return res.json({ ok: true })
    })
  }

  static async requestPasswordReset(req, res) {
    const { correo } = req.body

    try {
      const validation = validatePasswordResetRequest({ correo })
      if (!validation.success) {
        return res.status(422).json({
          error: 'Datos inválidos',
          details: validation.error.flatten(),
        })
      }

      const user = await prisma.usuarios.findUnique({
        where: { correo },
        select: {
          id: true,
          correo: true,
          nombre: true,
        },
      })

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({
          message:
            'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña',
        })
      }

      // Generate reset token
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // Delete any existing reset tokens for this user
      await prisma.password_reset_tokens.deleteMany({
        where: { usuario_id: user.id },
      })

      // Create new reset token
      await prisma.password_reset_tokens.create({
        data: {
          usuario_id: user.id,
          token: Buffer.from(token.replace(/-/g, ''), 'hex').slice(0, 16),
          expira_at: expiresAt,
        },
      })

      // Send email (non-blocking - don't fail if email config is missing)
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`
      const html = passwordResetEmail(user.nombre, resetUrl)

      sendEmail({
        to: user.correo,
        subject: 'Restablecer contraseña - CAIS',
        html,
      }).catch((err) => {
        console.error(
          '⚠️ No se pudo enviar correo de reset (configura EMAIL_USER/EMAIL_PASS en .env):',
          err.message
        )
      })

      return res.json({
        message:
          'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña',
      })
    } catch (err) 
    {
      console.error('Error solicitando reset de password:', err)
      return res.status(500).json({ error: 'Error del servidor' })
    }
  }

  static async resetPassword(req, res) {
    const { token, password, confirmPassword } = req.body

    try {
      const validation = validatePasswordReset({
        token,
        password,
        confirmPassword,
      })
      if (!validation.success) {
        return res.status(422).json({
          error: 'Datos inválidos',
          details: validation.error.flatten(),
        })
      }

      // Find the reset token
      const tokenBuffer = Buffer.from(token.replace(/-/g, ''), 'hex').slice(
        0,
        16
      )

      const resetToken = await prisma.password_reset_tokens.findUnique({
        where: { token: tokenBuffer },
        include: { usuarios: true },
      })

      if (!resetToken) {
        return res.status(400).json({ error: 'Token inválido' })
      }

      if (resetToken.usado) {
        return res.status(400).json({ error: 'Token ya utilizado' })
      }

      if (resetToken.expira_at < new Date()) {
        await prisma.password_reset_tokens.delete({
          where: { token: tokenBuffer },
        })
        return res.status(400).json({ error: 'Token expirado' })
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 10)

      // Update user password and mark token as used
      await prisma.$transaction([
        prisma.usuarios.update({
          where: { id: resetToken.usuario_id },
          data: { password_hash: passwordHash },
        }),
        prisma.password_reset_tokens.update({
          where: { token: tokenBuffer },
          data: { usado: true },
        }),
      ])

      return res.json({ message: 'Contraseña actualizada exitosamente' })
    } catch (err) {
      console.error('Error reseteando contraseña:', err)
      return res.status(500).json({ error: 'Error del servidor' })
    }
  }

  /**
   * DEV ONLY - NOT FOR PRODUCTION
   * 
   * Retrieves the most recent unused password reset token from the database.
   * - Development/testing tool to quickly obtain a valid reset token
   * - Avoids the need to check email or database manually during development
   * - Useful for testing password reset flow in local/staging environments
   *
   * @route GET /api/auth/reset-password/dev-token
   * @access Development/Staging only
   * @returns {Object} Token data including: token (UUID), usuario (email), expira_at, creado_at
   */
  // static async getDevResetToken(req, res) {
  //   if (process.env.NODE_ENV === 'production') {
  //     return res.status(403).json({ error: 'No disponible en producción' })
  //   }
  //   try {
  //     const token = await prisma.password_reset_tokens.findFirst({
  //       where: { usado: false },
  //       orderBy: { creado_at: 'desc' },
  //       select: {
  //         id: true,
  //         usuario_id: true,
  //         token: true,
  //         expira_at: true,
  //         creado_at: true,
  //         usuarios: { select: { correo: true } },
  //       },
  //     })
  //     if (!token) return res.status(404).json({ error: 'No hay tokens activos' })
  //     return res.json({
  //       token: bufferToUUID(token.token),
  //       usuario: token.usuarios?.correo,
  //       expira_at: token.expira_at,
  //       creado_at: token.creado_at,
  //     })
  //   } catch (err) {
  //     return res.status(500).json({ error: 'Error del servidor' })
  //   }
  // }
}
