import request from 'supertest'
import app from '../app.js'
import assert from 'assert'

const api = request(app)

// ─── POST /auth/login ───────────────────────────────────────────────

describe('POST /auth/login', () => {
  test('200 — login con credenciales correctas', async () => {
    // Usa el usuario de prueba del seed (carlos.herrera@cais.com / $123)
    const res = await api.post('/auth/login').send({
      email: 'carlos.herrera@cais.com',
      password: '123',
    })

    assert.equal(res.status, 200)
    assert(res.body.id !== undefined, 'body.id should exist')
    assert.equal(res.body.email, 'carlos.herrera@cais.com')
  })

  test('401 — correo no registrado', async () => {
    const res = await api.post('/auth/login').send({
      email: 'no.existe@test.com',
      password: 'cualquier',
    })

    assert.equal(res.status, 401)
    assert(res.body.error !== undefined, 'body.error should exist')
  })

  test('401 — contraseña incorrecta', async () => {
    const res = await api.post('/auth/login').send({
      email: 'carlos.herrera@cais.com',
      password: 'incorrecta',
    })

    assert.equal(res.status, 401)
    assert(res.body.error !== undefined, 'body.error should exist')
  })

  test('500 / 400 — body vacío', async () => {
    const res = await api.post('/auth/login').send({})
    assert(
      [400, 401, 500].includes(res.status),
      `status should be 400, 401, or 500, got ${res.status}`
    )
  })
})
