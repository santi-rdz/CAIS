/**
 * @file Tests de integración para los endpoints de autenticación.
 */

import request from 'supertest'
import app from '#app'
import assert from 'assert'

const api = request(app)

// ─── POST /auth/login ───────────────────────────────────────────────────────

describe('POST /auth/login', () => {
  test('200 — login con credenciales correctas', async () => {
    const res = await api.post('/auth/login').send({
      email: 'carlos.herrera@cais.com',
      password: '123',
    })
    assert.equal(res.status, 200)
    assert.equal(res.body.ok, true)
  })

  test('401 — correo no registrado', async () => {
    const res = await api.post('/auth/login').send({
      email: 'no.existe@test.com',
      password: 'cualquier',
    })
    assert.equal(res.status, 401)
    assert(res.body.error !== undefined)
  })

  test('401 — contraseña incorrecta', async () => {
    const res = await api.post('/auth/login').send({
      email: 'carlos.herrera@cais.com',
      password: 'incorrecta',
    })
    assert.equal(res.status, 401)
    assert(res.body.error !== undefined)
  })

  test('400 / 401 / 500 — body vacío', async () => {
    const res = await api.post('/auth/login').send({})
    assert(
      [400, 401, 500].includes(res.status),
      `status inesperado: ${res.status}`
    )
  })

  test('403 — cuenta desactivada no puede iniciar sesión', async () => {
    const { prisma } = await import('#config/prisma.js')
    const { uuidToBuffer } = await import('#lib/uuid.js')
    const { randomUUID } = await import('node:crypto')
    const bcrypt = await import('bcryptjs')

    const correo = `inactivo.${Date.now()}@test.com`
    const userId = randomUUID()

    const [inactiveStatus, roleRow] = await Promise.all([
      prisma.estados.findFirst({ where: { codigo: 'INACTIVO' } }),
      prisma.roles.findFirst({ where: { codigo: 'PASANTE' } }),
    ])

    await prisma.usuarios.create({
      data: {
        id: uuidToBuffer(userId),
        nombre: 'Test Inactivo',
        correo,
        password_hash: await bcrypt.hash('Test1234!', 10),
        estado_id: inactiveStatus.id,
        rol_id: roleRow.id,
      },
    })

    try {
      const res = await api
        .post('/auth/login')
        .send({ email: correo, password: 'Test1234!' })
      assert.equal(res.status, 403)
      assert.equal(res.body.error, 'Cuenta desactivada')
    } finally {
      await prisma.usuarios.delete({ where: { id: uuidToBuffer(userId) } })
    }
  })
})

// ─── POST /auth/password/forgot ─────────────────────────────────────────────

describe('POST /auth/password/forgot', () => {
  test('200 — correo existente devuelve mensaje genérico', async () => {
    const res = await api.post('/auth/password/forgot').send({
      correo: 'carlos.herrera@cais.com',
    })
    assert.equal(res.status, 200)
    assert(typeof res.body.message === 'string')
  })

  test('200 — correo inexistente devuelve el mismo mensaje (anti-enumeración)', async () => {
    const res = await api.post('/auth/password/forgot').send({
      correo: 'no.existe@test.com',
    })
    assert.equal(res.status, 200)
    assert(typeof res.body.message === 'string')
  })

  test('422 — correo inválido', async () => {
    const res = await api
      .post('/auth/password/forgot')
      .send({ correo: 'noesuncorreo' })
    assert.equal(res.status, 422)
    assert(res.body.error !== undefined)
  })

  test('422 — body vacío', async () => {
    const res = await api.post('/auth/password/forgot').send({})
    assert.equal(res.status, 422)
  })
})

// ─── POST /auth/password/reset ──────────────────────────────────────────────

describe('POST /auth/password/reset', () => {
  test('400 — token inválido (uuid inexistente)', async () => {
    const res = await api.post('/auth/password/reset').send({
      token: '00000000-0000-0000-0000-000000000000',
      password: 'NuevaPass1!',
      confirmPassword: 'NuevaPass1!',
    })
    assert.equal(res.status, 400)
    assert(res.body.error !== undefined)
  })

  test('422 — token no es uuid', async () => {
    const res = await api.post('/auth/password/reset').send({
      token: 'no-es-uuid',
      password: 'NuevaPass1!',
      confirmPassword: 'NuevaPass1!',
    })
    assert.equal(res.status, 422)
  })

  test('422 — contraseñas no coinciden', async () => {
    const res = await api.post('/auth/password/reset').send({
      token: '00000000-0000-0000-0000-000000000000',
      password: 'NuevaPass1!',
      confirmPassword: 'Diferente1!',
    })
    assert.equal(res.status, 422)
  })

  test('422 — contraseña débil', async () => {
    const res = await api.post('/auth/password/reset').send({
      token: '00000000-0000-0000-0000-000000000000',
      password: 'debil',
      confirmPassword: 'debil',
    })
    assert.equal(res.status, 422)
  })
})

// ─── PATCH /auth/password ────────────────────────────────────────────────────

describe('PATCH /auth/password', () => {
  test('401 — sin sesión activa', async () => {
    const res = await api.patch('/auth/password').send({
      currentPassword: 'cualquiera',
      newPassword: 'NuevaPass1!',
      confirmNewPassword: 'NuevaPass1!',
    })
    assert.equal(res.status, 401)
  })

  test('422 — body vacío sin sesión devuelve 401', async () => {
    const res = await api.patch('/auth/password').send({})
    assert.equal(res.status, 401)
  })
})
