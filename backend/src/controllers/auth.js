import { prisma } from '../config/prisma.js'
import { bufferToUUID, uuidToBuffer } from '../lib/uuid.js'
import bcrypt from 'bcryptjs'
import { changePasswordSchema } from '../schemas/user.js'

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
    //console.log("Received login request with body:", req.body)

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

  static async changePassword(req, res) {
    const validation = changePasswordSchema.safeParse(req.body)

    if (!validation.success) {
      const error = validation.error.errors[0]?.message || 'Datos inválidos'
      return res.status(400).json({ error })
    }

    const { currentPassword, newPassword } = validation.data

    try {
      const user = await prisma.usuarios.findUnique({
        where: { id: uuidToBuffer(req.session.userId) },
        select: { id: true, password_hash: true },
      })

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password_hash)
      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' })
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10)

      await prisma.usuarios.update({
        where: { id: user.id },
        data: { password_hash: newPasswordHash },
      })

      req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Server error' })
        res.clearCookie('connect.sid')
        return res.json({ ok: true, message: 'Contraseña actualizada. Por favor inicie sesión nuevamente.' })
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Server error' })
    }
  }
}
