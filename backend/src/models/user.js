import { pool } from '../config/db.js'
import { randomUUID } from 'node:crypto'

export class UserModel {
  static async getAll({ status, sortBy, search, page, limit }) {
    let sql = `
    SELECT 
      BIN_TO_UUID(u.id) AS id,
      e.codigo AS estado,
      r.codigo AS rol,
      a.nombre AS area,
      u.creado_at,
      u.ultimo_acceso,
      u.foto,
      u.nombre,
      u.correo,
      u.telefono
    FROM usuarios u
    JOIN estados e ON u.estado_id = e.id
    JOIN roles r ON u.rol_id = r.id
    LEFT JOIN areas a ON u.area_id = a.id
    `

    const params = []
    const conditions = []

    if (status) {
      conditions.push('LOWER(e.codigo) = ?')
      params.push(status.toLowerCase())
    }

    if (search) {
      conditions.push('(u.nombre LIKE ? OR u.correo LIKE ?)')
      params.push(`%${search}%`)
      params.push(`%${search}%`)
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''
    sql += whereClause

    const sortOptions = {
      'nombre-asc': 'u.nombre ASC',
      'nombre-desc': 'u.nombre DESC',
      'login-asc': 'u.ultimo_acceso ASC',
      'login-desc': 'u.ultimo_acceso DESC',
    }

    if (sortBy && sortOptions[sortBy]) {
      sql += ` ORDER BY ${sortOptions[sortBy]}`
    } else {
      sql += ` ORDER BY u.creado_at DESC`
    }

    const offset = (page - 1) * limit
    sql += ` LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const countSql = `
    SELECT COUNT(*) as total
    FROM usuarios u
    JOIN estados e ON u.estado_id = e.id
    JOIN roles r ON u.rol_id = r.id
    LEFT JOIN areas a ON u.area_id = a.id
    ${whereClause}
    `

    const [[{ total }]] = await pool.query(countSql, params.slice(0, -2))
    const [users] = await pool.query(sql, params)

    return { users, count: total }
  }

  static async getById(id) {
    const sql = `
      SELECT 
        BIN_TO_UUID(u.id) AS id,
        u.password_hash,
        e.codigo AS estado,
        r.codigo AS rol,
        a.nombre AS area,
        u.creado_at,
        u.ultimo_acceso,
        u.foto,
        u.nombre,
        u.correo,
        u.fecha_nacimiento,
        u.telefono,
        u.matricula,
        u.inicio_servicio,
        u.fin_servicio
      FROM usuarios u
      JOIN estados e ON u.estado_id = e.id
      JOIN roles r ON u.rol_id = r.id
      LEFT JOIN areas a ON u.area_id = a.id
      WHERE u.id = UUID_TO_BIN(?)
    `
    const [rows] = await pool.query(sql, [id])
    return rows[0] || null
  }

  static async delete(id) {
    const [result] = await pool.query(`DELETE FROM usuarios WHERE id = UUID_TO_BIN(?)`, [id])
    return result.affectedRows > 0
  }

  static async update(id, data) {
    const fields = []
    const values = []

    // Nota: El objeto 'data' debe venir con las llaves en español (nombre, correo, etc.)
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`)
      values.push(value)
    }

    if (fields.length === 0) return null

    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`
    values.push(id)

    const [result] = await pool.query(sql, values)
    return result.affectedRows > 0 ? await this.getById(id) : null
  }

  static async preRegister(newUsers, conn) {
    const registeredUsers = []

    for (const u of newUsers) {
      const userId = u.id || randomUUID()

      const [[estadoRow]] = await conn.query('SELECT id FROM estados WHERE codigo = ?', [
        u.estado || 'PENDIENTE',
      ])

      const [[rolRow]] = await conn.query('SELECT id FROM roles WHERE codigo = ?', [
        u.rol || 'PASANTE',
      ])

      const [[areaRow]] = await conn.query('SELECT id FROM areas WHERE nombre = ?', [
        u.area || null,
      ])

      await conn.query(
        `INSERT INTO usuarios 
        (id, nombre, correo, fecha_nacimiento, telefono, estado_id, rol_id, area_id)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          u.nombre || null,
          u.correo,
          u.fechaNacimiento || null,
          u.telefono || null,
          estadoRow.id,
          rolRow.id,
          areaRow?.id || null,
        ],
      )

      const user = await this.getById(userId)
      registeredUsers.push(user)
    }

    return registeredUsers
  }

  static async fullRegister(user) {
    const conn = await pool.getConnection()

    try {
      await conn.beginTransaction()

      const userId = randomUUID()
      const foto =
        user.foto ||
        `https://randomuser.me/api/portraits/${Math.random() < 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99) + 1}.jpg`

      const [[estadoRow]] = await conn.query('SELECT id FROM estados WHERE codigo = ?', ['ACTIVO'])
      const [[rolRow]] = await conn.query('SELECT id FROM roles WHERE codigo = ?', [
        user.rol?.toUpperCase() || 'PASANTE',
      ])
      const [[areaRow]] = await conn.query('SELECT id FROM areas WHERE nombre = ?', [
        user.area?.toUpperCase() || null,
      ])

      await conn.query(
        `INSERT INTO usuarios 
        (id, nombre, correo, fecha_nacimiento, telefono, password_hash, estado_id, rol_id, area_id, foto)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          user.nombre,
          user.correo,
          user.fechaNacimiento,
          user.telefono,
          user.password, // Asegúrate de hashear esto antes de enviarlo aquí
          estadoRow.id,
          rolRow.id,
          areaRow?.id || null,
          foto,
        ],
      )

      const createdUser = await this.getById(userId)
      await conn.commit()
      return createdUser
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }
}
