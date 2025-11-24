// backend/models/user.js
import { pool } from '../db.js'
import { randomUUID } from 'node:crypto'

export class UserModel {
  // Traer todos los usuarios, opcionalmente filtrando por status
  static async getAll({ status }) {
    let sql = `
    SELECT 
      BIN_TO_UUID(u.person_id) AS id,
      u.password_hash,
      s.code AS status,
      r.code AS role,
      a.name AS area,
      u.created_at,
      u.last_login,
      u.picture,
      p.name,
      p.email,
      p.birth_date,
      p.phone
    FROM user u
    JOIN person p ON u.person_id = p.id
    JOIN status s ON u.status_id = s.id
    JOIN role r ON u.role_id = r.id
    LEFT JOIN area a ON u.area_id = a.id
  `

    const params = []

    if (status) {
      const lowerStatus = status.toLowerCase()
      sql += ` WHERE LOWER(s.code) = ?`
      params.push(lowerStatus)
    }

    // orden de craecion
    sql += ` ORDER BY u.created_at DESC`

    const [rows] = await pool.query(sql, params)
    return rows
  }

  // Traer un usuario por id
  static async getById(id) {
    const sql = `
      SELECT 
        BIN_TO_UUID(u.person_id) AS id,
        u.password_hash,
        s.code AS status,
        r.code AS role,
        a.name AS area,
        u.created_at,
        u.last_login,
        u.picture,
        p.name,
        p.email,
        p.birth_date,
        p.phone
      FROM user u
      JOIN person p ON u.person_id = p.id
      JOIN status s ON u.status_id = s.id
      JOIN role r ON u.role_id = r.id
      LEFT JOIN area a ON u.area_id = a.id
      WHERE u.person_id = UUID_TO_BIN(?)
    `
    const [rows] = await pool.query(sql, [id])
    return rows[0] || null
  }

  // Eliminar un usuario por id
  static async delete(id) {
    const [result] = await pool.query(`DELETE FROM user WHERE person_id = UUID_TO_BIN(?)`, [id])
    return result.affectedRows > 0
  }

  // Actualizar campos de un usuario
  static async update(id, data) {
    const fields = []
    const values = []
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
    if (fields.length === 0) return null

    const sql = `UPDATE user SET ${fields.join(', ')} WHERE person_id = UUID_TO_BIN(?)`
    values.push(id)
    const [result] = await pool.query(sql, values)
    return result.affectedRows > 0 ? await this.getById(id) : null
  }

  // Pre-registrar varios usuarios (status PENDING)
  static async preRegister(newUsers) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const registeredUsers = []

      for (const u of newUsers) {
        // Generar UUID para person_id
        const personId = randomUUID()
        // Insertar en person
        await conn.query(
          `INSERT INTO person (id, name, email, birth_date, phone) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
          [personId, u.name || null, u.email, u.birthDay || null, u.phone || null]
        )

        // Traer IDs de status, role y area según códigos/nombres
        const [[statusRow]] = await conn.query('SELECT id FROM status WHERE code = ?', [
          u.status || 'PENDIENTE',
        ])
        const [[roleRow]] = await conn.query('SELECT id FROM role WHERE code = ?', [
          u.role || 'PASANTE',
        ])
        const [[areaRow]] = await conn.query('SELECT id FROM area WHERE name = ?', [u.area || null])

        // Insertar en user
        await conn.query(
          `INSERT INTO user (person_id, status_id, role_id, area_id, created_at) VALUES (UUID_TO_BIN(?), ?, ?, ?, NOW())`,
          [personId, statusRow.id, roleRow.id, areaRow?.id || null]
        )

        // Traer el usuario completo con joins
        const [[row]] = await conn.query(
          `
        SELECT 
          BIN_TO_UUID(u.person_id) AS id,
          u.password_hash,
          s.code AS status,
          r.code AS role,
          a.name AS area,
          u.created_at,
          u.last_login,
          u.picture,
          p.name,
          p.email,
          p.birth_date,
          p.phone
        FROM user u
        JOIN person p ON u.person_id = p.id
        JOIN status s ON u.status_id = s.id
        JOIN role r ON u.role_id = r.id
        LEFT JOIN area a ON u.area_id = a.id
        WHERE u.person_id = UUID_TO_BIN(?)
        `,
          [personId]
        )
        registeredUsers.push(row)
      }

      await conn.commit()
      return registeredUsers
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  // Registrar un usuario completo (status ACTIVE)
  static async fullRegister(user) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      // Generar UUID
      const personId = randomUUID()

      // Generar avatar aleatorio si no se envía
      const picture =
        user.picture ||
        `https://randomuser.me/api/portraits/${Math.random() < 0.5 ? 'men' : 'women'}/${
          Math.floor(Math.random() * 99) + 1
        }.jpg`

      // Insertar en person
      await conn.query(
        `INSERT INTO person (id, name, email, birth_date, phone) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
        [personId, user.name, user.email, user.birthDay, user.phone]
      )

      // Traer IDs de status, role y area
      const [[statusRow]] = await conn.query('SELECT id FROM status WHERE code = ?', ['ACTIVO'])
      const [[roleRow]] = await conn.query('SELECT id FROM role WHERE code = ?', [
        user.rol?.toUpperCase() || 'PASANTE',
      ])
      const [[areaRow]] = await conn.query('SELECT id FROM area WHERE name = ?', [
        user.area?.toUpperCase() || null,
      ])

      // Insertar en user con UUID de Node y avatar aleatorio
      await conn.query(
        `INSERT INTO user (person_id, password_hash, status_id, role_id, area_id, picture, created_at) 
       VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, NOW())`,
        [personId, user.password, statusRow.id, roleRow.id, areaRow?.id || null, picture]
      )

      // Traer usuario completo legible
      const [[row]] = await conn.query(
        `
      SELECT 
        BIN_TO_UUID(u.person_id) AS id,
        u.password_hash,
        s.code AS status,
        r.code AS role,
        a.name AS area,
        u.created_at,
        u.last_login,
        u.picture,
        p.name,
        p.email,
        p.birth_date,
        p.phone
      FROM user u
      JOIN person p ON u.person_id = p.id
      JOIN status s ON u.status_id = s.id
      JOIN role r ON u.role_id = r.id
      LEFT JOIN area a ON u.area_id = a.id
      WHERE u.person_id = UUID_TO_BIN(?)
      `,
        [personId]
      )

      await conn.commit()
      return row
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }
}
