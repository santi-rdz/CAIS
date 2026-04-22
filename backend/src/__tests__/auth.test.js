/**
 * @file Tests de integración para el endpoint de autenticación.
 * @description Verifica login, errores de credenciales y body vacío.
 */

import request from 'supertest'
import app from '#app'
import assert from 'assert'

const api = request(app)

// ─── POST /auth/login ───────────────────────────────────────────────

/**
 * @description Suite para POST /auth/login.
 * Cubre login exitoso, credenciales incorrectas y body vacío.
 */
describe('POST /auth/login', () => {
  /**
   * @test Login con credenciales válidas devuelve 200 y ok: true.
   */
  test('200 — login con credenciales correctas', async () => {
    const res = await api.post('/auth/login').send({
      email: 'carlos.herrera@cais.com',
      password: '123',
    })

    assert.equal(res.status, 200)
    assert.equal(res.body.ok, true)
  })

  /**
   * @test Correo no registrado devuelve 401 con propiedad error.
   */
  test('401 — correo no registrado', async () => {
    const res = await api.post('/auth/login').send({
      email: 'no.existe@test.com',
      password: 'cualquier',
    })

    assert.equal(res.status, 401)
    assert(res.body.error !== undefined, 'body.error should exist')
  })

  /**
   * @test Contraseña incorrecta para correo existente devuelve 401.
   */
  test('401 — contraseña incorrecta', async () => {
    const res = await api.post('/auth/login').send({
      email: 'carlos.herrera@cais.com',
      password: 'incorrecta',
    })

    assert.equal(res.status, 401)
    assert(res.body.error !== undefined, 'body.error should exist')
  })

  /**
   * @test Body vacío devuelve 400, 401 o 500 (cualquier error válido).
   */
  test('500 / 400 — body vacío', async () => {
    const res = await api.post('/auth/login').send({})
    assert(
      [400, 401, 500].includes(res.status),
      `status should be 400, 401, or 500, got ${res.status}`
    )
  })

  /**
   * @test Usuario con estado INACTIVO devuelve 403 tras autenticar credenciales correctas.
   */
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
      assert(res.body.error !== undefined, 'body.error should exist')
    } finally {
      await prisma.usuarios.delete({ where: { id: uuidToBuffer(userId) } })
    }
  })
})
