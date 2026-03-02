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

  static async create(userData, conn) {
    const userId = randomUUID()

    const [[estadoRow]] = await conn.query('SELECT id FROM estados WHERE codigo = ?', ['ACTIVO'])
    const [[rolRow]] = await conn.query('SELECT id FROM roles WHERE LOWER(codigo) = ?', [
      userData.rol.toLowerCase(),
    ])

    await conn.query(
      `INSERT INTO usuarios
        (id, nombre, correo, fecha_nacimiento, telefono, password_hash, estado_id, rol_id, foto, matricula, cedula, inicio_servicio, fin_servicio)
       VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        userData.nombre,
        userData.correo,
        userData.fechaNacimiento,
        userData.telefono,
        userData.passwordHash,
        estadoRow.id,
        rolRow.id,
        userData.foto || null,
        userData.matricula || null,
        userData.cedula || null,
        userData.inicioServicio || null,
        userData.finServicio || null,
      ],
    )

    return await this.getById(userId)
  }
}
