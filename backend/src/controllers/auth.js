import { pool } from '../config/db.js'
import bcrypt from 'bcryptjs'

export class AuthController {
  /**
   * POST /login
   * Autentica a un usuario verificando sus credenciales y retorna su id y correo.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async login(req, res) {
    const { email, password } = req.body

    try {
      // Buscar usuario
      const [rows] = await pool.query(
        `SELECT BIN_TO_UUID(u.id) AS id, u.correo, u.password_hash AS password
         FROM usuarios u
         WHERE u.correo = ?`,
        [email],
      )

      const user = rows[0]

      // Usuario no encontrado
      if (!user) {
        return res.status(401).json({ error: 'Correo electronico no encontrado' })
      }

      // Comparar password usando bcrypt
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña invalida' })
      }

      // Éxito → regresar usuario
      return res.json({ email, id: user.id })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Server error' })
    }
  }
}
