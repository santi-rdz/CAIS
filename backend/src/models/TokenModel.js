import { pool } from '../config/db.js'

export class InvitacionModel {
  /**
   * Inserta invitaciones de registro en bulk dentro de una transacción.
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
   * Busca una invitación válida por token.
   * Válida = no usada y no expirada.
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
   * Marca una invitación como usada.
   */
  static async markAsUsed(token, conn) {
    const connection = conn || pool
    await connection.query(
      `UPDATE invitaciones_registro SET usado = TRUE WHERE token = UUID_TO_BIN(?)`,
      [token],
    )
  }
}
