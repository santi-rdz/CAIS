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

// ─── Flujo completo: forgot → reset ─────────────────────────────────────────

describe('Flujo completo: forgot password → reset password', () => {
  let prisma, uuidToBuffer, bufferToUUID, bcrypt, userId, correo

  beforeAll(async () => {
    ;({ prisma } = await import('#config/prisma.js'))
    ;({ uuidToBuffer, bufferToUUID } = await import('#lib/uuid.js'))
    bcrypt = await import('bcryptjs')
    const { randomUUID } = await import('node:crypto')

    correo = `reset.flow.${Date.now()}@test.com`
    userId = randomUUID()

    const [activeStatus, roleRow] = await Promise.all([
      prisma.estados.findFirst({ where: { codigo: 'ACTIVO' } }),
      prisma.roles.findFirst({ where: { codigo: 'PASANTE' } }),
    ])

    await prisma.usuarios.create({
      data: {
        id: uuidToBuffer(userId),
        nombre: 'Test Reset',
        correo,
        password_hash: await bcrypt.hash('OldPass1!', 10),
        estado_id: activeStatus.id,
        rol_id: roleRow.id,
      },
    })
  })

  afterAll(async () => {
    await prisma.usuarios.delete({ where: { id: uuidToBuffer(userId) } })
  })

  test('forgot: crea token en DB para usuario existente', async () => {
    const res = await api.post('/auth/password/forgot').send({ correo })
    assert.equal(res.status, 200)

    const userRow = await prisma.usuarios.findUnique({
      where: { id: uuidToBuffer(userId) },
    })
    const token = await prisma.password_reset_tokens.findFirst({
      where: { usuario_id: userRow.id },
    })
    assert(token !== null, 'Debe existir un token en DB')
    assert.equal(token.usado, false)
    assert(token.expira_at > new Date(), 'El token no debe estar expirado')
  })

  test('reset: actualiza password_hash e invalida el token', async () => {
    const userRow = await prisma.usuarios.findUnique({
      where: { id: uuidToBuffer(userId) },
      select: { id: true, password_hash: true },
    })
    const tokenRow = await prisma.password_reset_tokens.findFirst({
      where: { usuario_id: userRow.id },
    })
    const token = bufferToUUID(tokenRow.token)

    const res = await api.post('/auth/password/reset').send({
      token,
      password: 'NewPass1!',
      confirmPassword: 'NewPass1!',
    })
    assert.equal(res.status, 200)

    const updated = await prisma.usuarios.findUnique({
      where: { id: userRow.id },
      select: { password_hash: true },
    })
    const passwordChanged = await bcrypt.compare(
      'NewPass1!',
      updated.password_hash
    )
    assert(passwordChanged, 'La contraseña debe haberse actualizado')

    const usedToken = await prisma.password_reset_tokens.findFirst({
      where: { usuario_id: userRow.id },
    })
    assert.equal(
      usedToken.usado,
      true,
      'El token debe estar marcado como usado'
    )
  })

  test('reset: token ya usado devuelve 400', async () => {
    const userRow = await prisma.usuarios.findUnique({
      where: { id: uuidToBuffer(userId) },
    })
    const tokenRow = await prisma.password_reset_tokens.findFirst({
      where: { usuario_id: userRow.id },
    })
    const token = bufferToUUID(tokenRow.token)

    const res = await api.post('/auth/password/reset').send({
      token,
      password: 'AnotherPass1!',
      confirmPassword: 'AnotherPass1!',
    })
    assert.equal(res.status, 400)
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
