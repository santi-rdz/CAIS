import { pool } from '../config/db.js'

export async function login(req, res) {
  const { email, password } = req.body

  try {
    // Buscar usuario
    const [rows] = await pool.query(
      `SELECT 
      BIN_TO_UUID(u.id) AS id,
      u.correo,
      u.password_hash AS password
      FROM usuarios u
      WHERE u.correo = ?`,
      [email],
    )

    const user = rows[0]

    // Usuario no encontrado
    if (!user) {
      return res.status(401).json({ error: 'Correo electronico no encontrado' })
    }

    // Comparar password (sin hashing)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Contraseña invalida' })
    }

    // Éxito → regresar usuario
    return res.json({ email, id: user.id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
