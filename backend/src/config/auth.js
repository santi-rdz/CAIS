import { betterAuth } from 'better-auth'
import { pool } from './db.js'
import { jwt } from 'better-auth/plugins'

export const auth = betterAuth({
  logger: {
    level: 'debug',
    disabled: false,
  },
  adapter: {
    user: {
      // Login → busca usuario por email
      async getUser({ email }) {
        console.log('ttakmdaskm')
        const [rows] = await pool.query(
          `SELECT
             BIN_TO_UUID(u.person_id) AS id,
             u.password_hash AS password,
             p.email,
             r.code AS role,
             s.code AS status
           FROM user u
           JOIN person p ON u.person_id = p.id
           JOIN role r ON u.role_id = r.id
           JOIN status s ON u.status_id = s.id
           WHERE p.email = ?`,
          [email]
        )
        return rows[0] || null
      },

      // Obtener usuario por ID
      async getUserById({ id }) {
        const [rows] = await pool.query(
          `SELECT
             BIN_TO_UUID(u.person_id) AS id,
             u.password_hash AS password,
             p.email,
             r.code AS role,
             s.code AS status
           FROM user u
           JOIN person p ON u.person_id = p.id
           JOIN role r ON u.role_id = r.id
           JOIN status s ON u.status_id = s.id
           WHERE u.person_id = UUID_TO_BIN(?)`,
          [id]
        )
        return rows[0] || null
      },

      async createUser() {
        return null
      },

      async updateUser() {
        return null
      },

      async deleteUser() {
        return null
      },
    },

    session: {
      async createSession() {
        console.log('object')
        return null
      },
      async getSession() {
        return null
      },
      async deleteSession() {
        return null
      },
    },
  },

  // ======================
  //  AUTH CONFIG
  // ======================
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.BETTER_AUTH_URL,
  plugins: [jwt()],
  emailAndPassword: { enabled: true },
})

// secret: process.env.BETTER_AUTH_SECRET,
// baseURL: 'http://localhost:8000',
