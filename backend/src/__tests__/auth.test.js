import request from 'supertest'
import app from '#app'
import bcrypt from 'bcryptjs'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { NIL_UUID, SEED_USERS } from './helpers/constants.js'
import { createUserDirect } from './helpers/fixtures.js'
import {
  ALT_STRONG_TEST_PASSWORD,
  MISMATCH_CONFIRM_PASSWORD,
  NEXT_STRONG_TEST_PASSWORD,
  OLD_STRONG_TEST_PASSWORD,
  SECOND_STRONG_TEST_PASSWORD,
  STRONG_TEST_PASSWORD,
  WEAK_TEST_PASSWORD,
} from './helpers/passwords.js'

const api = request(app)
const VALID_STRONG_PASSWORD = ALT_STRONG_TEST_PASSWORD

describe('POST /auth/login', () => {
  test('200 — login con credenciales correctas', async () => {
    const res = await api.post('/auth/login').send(SEED_USERS.coordMedicina)
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  test('401 — correo no registrado', async () => {
    const res = await api.post('/auth/login').send({
      email: 'no.existe@test.com',
      password: 'cualquier',
    })
    expect(res.status).toBe(401)
    expect(res.body.error).toBeDefined()
  })

  test('401 — contraseña incorrecta', async () => {
    const res = await api.post('/auth/login').send({
      email: SEED_USERS.coordMedicina.email,
      password: 'incorrecta',
    })
    expect(res.status).toBe(401)
    expect(res.body.error).toBeDefined()
  })

  test('body vacío devuelve 400/401/500 (no es 2xx)', async () => {
    const res = await api.post('/auth/login').send({})
    expect([400, 401, 500]).toContain(res.status)
  })

  test('403 — cuenta desactivada no puede iniciar sesión', async () => {
    const user = await createUserDirect({ estado: 'INACTIVO' })

    try {
      const res = await api
        .post('/auth/login')
        .send({ email: user.correo, password: STRONG_TEST_PASSWORD })
      expect(res.status).toBe(403)
      expect(res.body.error).toBe('Cuenta desactivada')
    } finally {
      await user.cleanup()
    }
  })
})

describe('POST /auth/password/forgot', () => {
  test('200 — correo existente devuelve mensaje genérico', async () => {
    const res = await api
      .post('/auth/password/forgot')
      .send({ correo: SEED_USERS.coordMedicina.email })
    expect(res.status).toBe(200)
    expect(typeof res.body.message).toBe('string')
  })

  test('200 — correo inexistente devuelve mismo mensaje (anti-enumeración)', async () => {
    const res = await api.post('/auth/password/forgot').send({ correo: 'no.existe@test.com' })
    expect(res.status).toBe(200)
    expect(typeof res.body.message).toBe('string')
  })

  test('422 — correo inválido', async () => {
    const res = await api.post('/auth/password/forgot').send({ correo: 'noesuncorreo' })
    expect(res.status).toBe(422)
    expect(res.body.error).toBeDefined()
  })

  test('422 — body vacío', async () => {
    const res = await api.post('/auth/password/forgot').send({})
    expect(res.status).toBe(422)
  })
})

describe('POST /auth/password/reset', () => {
  test('400 — token UUID válido pero inexistente en DB', async () => {
    const res = await api.post('/auth/password/reset').send({
      token: NIL_UUID,
      password: VALID_STRONG_PASSWORD,
      confirmPassword: VALID_STRONG_PASSWORD,
    })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  test('422 — token con formato no UUID', async () => {
    const res = await api.post('/auth/password/reset').send({
      token: 'no-es-uuid',
      password: VALID_STRONG_PASSWORD,
      confirmPassword: VALID_STRONG_PASSWORD,
    })
    expect(res.status).toBe(422)
  })

  test('422 — contraseñas no coinciden', async () => {
    const res = await api.post('/auth/password/reset').send({
      token: NIL_UUID,
      password: VALID_STRONG_PASSWORD,
      confirmPassword: MISMATCH_CONFIRM_PASSWORD,
    })
    expect(res.status).toBe(422)
  })

  test('422 — contraseña débil', async () => {
    const res = await api.post('/auth/password/reset').send({
      token: NIL_UUID,
      password: WEAK_TEST_PASSWORD,
      confirmPassword: WEAK_TEST_PASSWORD,
    })
    expect(res.status).toBe(422)
  })
})

describe('Flujo completo: forgot → reset', () => {
  let user

  beforeAll(async () => {
    user = await createUserDirect({ password: OLD_STRONG_TEST_PASSWORD })
  })

  afterAll(async () => {
    await user.cleanup()
  })

  test('forgot: crea token activo en DB', async () => {
    const res = await api.post('/auth/password/forgot').send({ correo: user.correo })
    expect(res.status).toBe(200)

    const token = await prisma.password_reset_tokens.findFirst({
      where: { usuario_id: uuidToBuffer(user.id) },
    })
    expect(token).not.toBeNull()
    expect(token.usado).toBe(false)
    expect(token.expira_at.getTime()).toBeGreaterThan(Date.now())
  })

  test('reset: actualiza password_hash e invalida el token', async () => {
    const tokenRow = await prisma.password_reset_tokens.findFirst({
      where: { usuario_id: uuidToBuffer(user.id) },
    })

    const res = await api.post('/auth/password/reset').send({
      token: bufferToUUID(tokenRow.token),
      password: NEXT_STRONG_TEST_PASSWORD,
      confirmPassword: NEXT_STRONG_TEST_PASSWORD,
    })
    expect(res.status).toBe(200)

    const updated = await prisma.usuarios.findUnique({
      where: { id: uuidToBuffer(user.id) },
      select: { password_hash: true },
    })
    expect(await bcrypt.compare(NEXT_STRONG_TEST_PASSWORD, updated.password_hash)).toBe(true)

    const usedToken = await prisma.password_reset_tokens.findFirst({
      where: { usuario_id: uuidToBuffer(user.id) },
    })
    expect(usedToken.usado).toBe(true)
  })

  test('reset: token ya usado devuelve 400', async () => {
    const tokenRow = await prisma.password_reset_tokens.findFirst({
      where: { usuario_id: uuidToBuffer(user.id) },
    })

    const res = await api.post('/auth/password/reset').send({
      token: bufferToUUID(tokenRow.token),
      password: SECOND_STRONG_TEST_PASSWORD,
      confirmPassword: SECOND_STRONG_TEST_PASSWORD,
    })
    expect(res.status).toBe(400)
  })
})

describe('PATCH /auth/password', () => {
  test('401 — sin sesión activa', async () => {
    const res = await api.patch('/auth/password').send({
      currentPassword: 'cualquiera',
      password: VALID_STRONG_PASSWORD,
      confirmPassword: VALID_STRONG_PASSWORD,
    })
    expect(res.status).toBe(401)
  })

  test('401 — body vacío sin sesión también devuelve 401', async () => {
    const res = await api.patch('/auth/password').send({})
    expect(res.status).toBe(401)
  })
})
