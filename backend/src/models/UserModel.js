import { pool } from '../config/db.js'
import { randomUUID } from 'node:crypto'

export class UserModel {
  /**
   * Obtiene una lista paginada de usuarios basada en criterios de búsqueda, estado y ordenamiento.
   *
   * @param {Object} params - Parámetros de consulta.
   * @param {string} [params.status] - Filtrar por código de estado (ej. 'ACTIVO').
   * @param {string} [params.sortBy] - Criterio de ordenamiento (ej. 'nombre-asc').
   * @param {string} [params.search] - Texto para buscar en nombre o correo.
   * @param {number} params.page - Número de página actual.
   * @param {number} params.limit - Cantidad de registros por página.
   * @returns {Promise<{users: Array<Object>, count: number}>} Lista de usuarios y total de registros.
   */
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

    const whereClause =
      conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''
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

  /**
   * Obtiene la información detallada de un usuario por su ID.
   *
   * @param {string} id - El ID (UUID) del usuario a buscar.
   * @returns {Promise<Object|null>} Los datos del usuario o null si no se encuentra.
   */
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

  /**
   * Elimina un usuario de la base de datos de manera física.
   *
   * @param {string} id - El ID (UUID) del usuario a eliminar.
   * @returns {Promise<boolean>} Retorna true si el usuario fue eliminado, false en caso contrario.
   */
  static async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM usuarios WHERE id = UUID_TO_BIN(?)`,
      [id]
    )
    return result.affectedRows > 0
  }

  /**
   * Actualiza los datos de un usuario de forma dinámica según los campos proporcionados.
   *
   * @param {string} id - El ID (UUID) del usuario a actualizar.
   * @param {Object} data - Objeto con los campos a actualizar (llaves en español).
   * @returns {Promise<Object|null>} El usuario actualizado o null si no se modificó nada.
   */
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

  /**
   * Crea un nuevo usuario en la base de datos dentro de una transacción.
   *
   * @param {Object} userData - Datos del usuario a crear.
   * @param {Object} conn - Conexión de la base de datos usada para la transacción.
   * @returns {Promise<Object>} El usuario recién creado.
   */
  static async create(userData, conn) {
    const userId = randomUUID()

    const [[estadoRow]] = await conn.query(
      'SELECT id FROM estados WHERE codigo = ?',
      ['ACTIVO']
    )
    if (!userData?.rol) {
      throw new Error('El rol es requerido')
    }
    const [[rolRow]] = await conn.query(
      'SELECT id FROM roles WHERE LOWER(codigo) = ?',
      [userData.rol.toLowerCase()]
    )
    if (!estadoRow || !rolRow) {
      throw new Error('Estado o rol inválido')
    }

    await conn.query(
      `INSERT INTO usuarios
        (id, nombre, correo, fecha_nacimiento, telefono, password_hash, estado_id, rol_id, foto, matricula, cedula, inicio_servicio, fin_servicio)
       VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        userData.nombre,
        userData.correo,
        new Date(userData.fechaNacimiento).toISOString().split('T')[0],
        userData.telefono,
        userData.passwordHash,
        estadoRow.id,
        rolRow.id,
        userData.foto || null,
        userData.matricula || null,
        userData.cedula || null,
        userData.inicioServicio || null,
        userData.finServicio || null,
      ]
    )

    return await this.getById(userId)
  }
}
