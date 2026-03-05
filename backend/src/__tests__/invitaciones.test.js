import request from 'supertest'
import app from '../app.js'
import { pool } from '../config/db.js'
import { describe, test, expect, beforeAll, afterAll } from 'node:test'

const api = request(app)

// ─── POST /invitaciones ─────────────────────────────────────────────

describe('POST /invitaciones', () => {
  let creadorId

  beforeAll(async () => {
    const [rows] = await pool.query(
      `SELECT BIN_TO_UUID(id) AS id FROM usuarios LIMIT 1`
    )
    creadorId = rows[0]?.id
  })

  test('201 — crea invitación válida', async () => {
    const correo = `inv.${Date.now()}@test.com`
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send([{ email: correo, role: 'pasante' }])

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('created')

    // limpiar
    await pool.query('DELETE FROM invitaciones_registro WHERE correo = ?', [
      correo,
    ])
  })

  test('201 — crea múltiples invitaciones', async () => {
    const correos = [
      { email: `multi1.${Date.now()}@test.com`, role: 'pasante' },
      { email: `multi2.${Date.now()}@test.com`, role: 'coordinador' },
    ]

    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send(correos)

    expect(res.status).toBe(201)
    expect(res.body.created).toBe(2)

    // limpiar
    for (const c of correos) {
      await pool.query('DELETE FROM invitaciones_registro WHERE correo = ?', [
        c.email,
      ])
    }
  })

  test('400 — rechaza array vacío', async () => {
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send([])

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'ValidationError')
  })

  test('400 — rechaza email inválido', async () => {
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send([{ email: 'no-valido', role: 'pasante' }])

    expect(res.status).toBe(400)
  })

  test('400 — rechaza rol inválido', async () => {
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send([{ email: 'test@test.com', role: 'superadmin' }])

    expect(res.status).toBe(400)
  })

  test('409 — rechaza correo duplicado', async () => {
    const correo = `dup.inv.${Date.now()}@test.com`
    const payload = [{ email: correo, role: 'pasante' }]

    await api.post('/invitaciones').set('x-user-id', creadorId).send(payload)
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send(payload)

    expect(res.status).toBe(409)

    await pool.query('DELETE FROM invitaciones_registro WHERE correo = ?', [
      correo,
    ])
  })
})

// ─── GET /invitaciones/:token ───────────────────────────────────────

describe('GET /invitaciones/:token', () => {
  let testToken
  let testCorreo

  beforeAll(async () => {
    // Insertar invitación de prueba directamente
    const { randomUUID } = await import('node:crypto')
    testToken = randomUUID()
    testCorreo = `token.test.${Date.now()}@test.com`

    const [[rolRow]] = await pool.query(
      "SELECT id FROM roles WHERE codigo = 'PASANTE'"
    )
    const [[userRow]] = await pool.query('SELECT id FROM usuarios LIMIT 1')

    await pool.query(
      `INSERT INTO invitaciones_registro (correo, rol_id, token, expira_at, creado_por)
       VALUES (?, ?, UUID_TO_BIN(?), DATE_ADD(NOW(), INTERVAL 1 DAY), ?)`,
      [testCorreo, rolRow.id, testToken, userRow.id]
    )
  })

  afterAll(async () => {
    await pool.query('DELETE FROM invitaciones_registro WHERE correo = ?', [
      testCorreo,
    ])
  })

  test('200 — retorna correo y rol para token válido', async () => {
    const res = await api.get(`/invitaciones/${testToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('correo', testCorreo)
    expect(res.body).toHaveProperty('rol', 'PASANTE')
  })

  test('404 — token inexistente', async () => {
    const res = await api.get(
      '/invitaciones/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error', 'NotFound')
  })

  test('404 — token con formato inválido', async () => {
    const res = await api.get('/invitaciones/no-es-uuid')
    expect(res.status).toBe(404)
  })
})
