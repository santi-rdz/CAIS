import { prisma } from '../config/prisma.js'
import { bufferToUUID } from '../lib/uuid.js'
import bcrypt from 'bcryptjs'

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
        select: { id: true, correo: true, password_hash: true },
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

      return res.json({ email, id: bufferToUUID(user.id) })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Server error' })
    }
  }
}
