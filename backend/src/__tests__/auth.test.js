import request from 'supertest'
import app from '../app.js'

const api = request(app)

// ─── POST /auth/login ───────────────────────────────────────────────

describe('POST /auth/login', () => {
  test('200 — login con credenciales correctas', async () => {
    // Usa el usuario de prueba del seed (carlos.herrera@cais.com / $123)
    const res = await api.post('/auth/login').send({
      email: 'carlos.herrera@cais.com',
      password: '$123',
    })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('email', 'carlos.herrera@cais.com')
  })

  test('401 — correo no registrado', async () => {
    const res = await api.post('/auth/login').send({
      email: 'no.existe@test.com',
      password: 'cualquier',
    })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('401 — contraseña incorrecta', async () => {
    const res = await api.post('/auth/login').send({
      email: 'carlos.herrera@cais.com',
      password: 'incorrecta',
    })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('500 / 400 — body vacío', async () => {
    const res = await api.post('/auth/login').send({})
    expect([400, 401, 500]).toContain(res.status)
  })
})
