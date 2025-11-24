import { pool } from './db.js'

async function test() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result')
    console.log('DB Connection OK:', rows)
  } catch (error) {
    console.error('DB Connection Failed:', error)
  }
}

test()
