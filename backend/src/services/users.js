import { randomUUID } from 'node:crypto'
import { UserModel } from '../models/user.js'
import { TokenModel } from '../models/TokenModel.js'
import { pool } from '../config/db.js'
import { sendEmail } from '../lib/sendEmail.js'
import { registerEmail } from '../lib/registerEmail.js'

export class UserService {
  static async preRegister(usersData) {
    const usersWithToken = usersData.map((u) => ({
      ...u,
      personId: randomUUID(),
      token: randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    }))

    const conn = await pool.getConnection()
    let createdUsers = []

    try {
      await conn.beginTransaction()
      // creamos usuario + persona
      createdUsers = await UserModel.preRegister(usersWithToken, conn)
      // creamos tokens de registro
      await TokenModel.insertTokens(usersWithToken, conn)
      // guardamos cambios
      await conn.commit()
    } catch (error) {
      await conn.rollback()
      throw error
    } finally {
      conn.release()
    }

    // ---- Enviar correos fuera de la transacción ----
    const emailErrors = []
    for (const u of usersWithToken) {
      const url = `https://localhost:5173/register/${u.token}`
      

      try {
        await sendEmail({
          to: u.email,
          subject: 'Completa tu registro',
          html: registerEmail(u.email, url),
        })
      } catch (err) {
        emailErrors.push({ email: u.email, error: err.message })
      }
    }

    return {
      users: createdUsers,
      emailErrors,
      success: true,
    }
  }
}
