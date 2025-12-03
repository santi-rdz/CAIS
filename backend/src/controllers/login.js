import { pool } from '../config/db.js'

export async function login(req, res) {
  const { email, password } = req.body

  try {
    // Buscar usuario
    const [rows] = await pool.query(
      `SELECT 
        BIN_TO_UUID(u.person_id) AS id,
        p.email,
        u.password_hash AS password
       FROM user u
       JOIN person p ON u.person_id = p.id
       WHERE p.email = ?`,
      [email]
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
