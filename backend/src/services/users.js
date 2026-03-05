import { randomUUID } from 'node:crypto'
import { InvitacionModel } from '../models/TokenModel.js'
import { pool } from '../config/db.js'
import { sendEmail } from '../lib/sendEmail.js'
import { registerEmail } from '../lib/registerEmail.js'

export class UserService {
  /**
   * Pre-registro: crea invitaciones y envía correos.
   * Ya NO crea usuarios en estado PENDIENTE.
   * Solo inserta en invitaciones_registro.
   */
  static async preRegister(usersData, creadoPor) {
    // 1. Resolver rol_id para cada invitación
    const invitaciones = []
    for (const u of usersData) {
      const [[rolRow]] = await pool.query(
        'SELECT id FROM roles WHERE LOWER(codigo) = ?',
        [u.role.toLowerCase()]
      )
      if (!rolRow) throw new Error(`Rol "${u.role}" no existe`)

      invitaciones.push({
        correo: u.email,
        rolId: rolRow.id,
        token: randomUUID(),
        expiraAt: new Date(Date.now() + 1000 * 60 * 60 * 48), // 48 horas
        creadoPor,
      })
    }

    // 2. Insertar invitaciones en transacción
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await InvitacionModel.insertMany(invitaciones, conn)
      await conn.commit()
    } catch (error) {
      await conn.rollback()
      throw error
    } finally {
      conn.release()
    }

    // 3. Enviar correos (fuera de la transacción)
    const emailErrors = []
    for (const inv of invitaciones) {
      const url = `http://localhost:5173/registro?token=${inv.token}`
      try {
        await sendEmail({
          to: inv.correo,
          subject: 'Completa tu registro — CAIS',
          html: registerEmail(inv.correo, url),
        })
      } catch (err) {
        emailErrors.push({ email: inv.correo, error: err.message })
      }
    }

    return {
      created: invitaciones.length,
      emailErrors,
    }
  }
}
