import { pool } from '../config/db.js'

export class InvitacionModel {
  /**
   * Inserta múltiples invitaciones de registro en bloque (bulk) usando una transacción.
   * 
   * @param {Array<Object>} invitaciones - Lista de objetos de invitación.
   * @param {Object} conn - Conexión de base de datos activa para la transacción.
   * @returns {Promise<void>}
   */
  static async insertMany(invitaciones, conn) {
    for (const inv of invitaciones) {
      await conn.query(
        `INSERT INTO invitaciones_registro (correo, rol_id, token, expira_at, creado_por)
         VALUES (?, ?, UUID_TO_BIN(?), ?, UUID_TO_BIN(?))`,
        [inv.correo, inv.rolId, inv.token, inv.expiraAt, inv.creadoPor],
      )
    }
  }

  /**
   * Busca una invitación por su token y verifica que sea válida (no usada y no expirada).
   * 
   * @param {string} token - El token UUID de la invitación.
   * @returns {Promise<Object|null>} Los datos de la invitación o null si no es válida.
   */
  static async findByToken(token) {
    const [rows] = await pool.query(
      `SELECT
        i.id,
        i.correo,
        r.codigo AS rol,
        i.usado,
        i.expira_at
       FROM invitaciones_registro i
       JOIN roles r ON i.rol_id = r.id
       WHERE i.token = UUID_TO_BIN(?)
         AND i.usado = FALSE
         AND i.expira_at > NOW()`,
      [token],
    )
    return rows[0] || null
  }

  /**
   * Marca una invitación específica como usada en la base de datos.
   * 
   * @param {string} token - El token UUID de la invitación.
   * @param {Object} [conn] - Opcional. Conexión de base de datos activa para usar en una transacción.
   * @returns {Promise<void>}
   */
  static async markAsUsed(token, conn) {
    const connection = conn || pool
    await connection.query(
      `UPDATE invitaciones_registro SET usado = TRUE WHERE token = UUID_TO_BIN(?)`,
      [token],
    )
  }
}