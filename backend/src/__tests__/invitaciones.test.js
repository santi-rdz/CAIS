import request from 'supertest'
import app from '../app.js'
import { prisma } from '../config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '../lib/uuid.js'
import assert from 'assert'

const api = request(app)

// ─── POST /invitaciones ─────────────────────────────────────────────

describe('POST /invitaciones', () => {
  let creadorId

  beforeAll(async () => {
    const userRow = await prisma.usuarios.findFirst({ select: { id: true } })
    creadorId = bufferToUUID(userRow.id)
  })

  test('201 — crea invitación válida', async () => {
    const correo = `inv.${Date.now()}@test.com`
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send([{ email: correo, role: 'pasante' }])

    assert.equal(res.status, 201)
    assert(res.body['created'] !== undefined, 'property created should exist')

    await prisma.invitaciones_registro.deleteMany({ where: { correo } })
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

    assert.equal(res.status, 201)
    assert.equal(res.body.created, 2)

    await prisma.invitaciones_registro.deleteMany({
      where: { correo: { in: correos.map((c) => c.email) } },
    })
  })

  test('400 — rechaza array vacío', async () => {
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send([])

    assert.equal(res.status, 422)
    assert.equal(res.body['error'], 'ValidationError')
  })

  test('400 — rechaza email inválido', async () => {
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send([{ email: 'no-valido', role: 'pasante' }])

    assert.equal(res.status, 422)
  })

  test('400 — rechaza rol inválido', async () => {
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send([{ email: 'test@test.com', role: 'superadmin' }])

    assert.equal(res.status, 422)
  })

  test('409 — rechaza correo duplicado', async () => {
    const correo = `dup.inv.${Date.now()}@test.com`
    const payload = [{ email: correo, role: 'pasante' }]

    await api.post('/invitaciones').set('x-user-id', creadorId).send(payload)
    const res = await api
      .post('/invitaciones')
      .set('x-user-id', creadorId)
      .send(payload)

    assert.equal(res.status, 409)

    await prisma.invitaciones_registro.deleteMany({ where: { correo } })
  })
})

// ─── GET /invitaciones/:token ───────────────────────────────────────

describe('GET /invitaciones/:token', () => {
  let testToken
  let testCorreo

  beforeAll(async () => {
    const { randomUUID } = await import('node:crypto')
    testToken = randomUUID()
    testCorreo = `token.test.${Date.now()}@test.com`

    const rolRow = await prisma.roles.findFirst({
      where: { codigo: 'PASANTE' },
      select: { id: true },
    })
    const userRow = await prisma.usuarios.findFirst({ select: { id: true } })

    await prisma.invitaciones_registro.create({
      data: {
        correo: testCorreo,
        rol_id: rolRow.id,
        token: uuidToBuffer(testToken),
        expira_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        creado_por: userRow.id,
      },
    })
  })

  afterAll(async () => {
    await prisma.invitaciones_registro.deleteMany({
      where: { correo: testCorreo },
    })
  })

  test('200 — retorna correo y rol para token válido', async () => {
    const res = await api.get(`/invitaciones/${testToken}`)
    assert.equal(res.status, 200)
    assert.equal(res.body['correo'], testCorreo)
    assert.equal(res.body['rol'], 'PASANTE')
  })

  test('404 — token inexistente', async () => {
    const res = await api.get(
      '/invitaciones/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
    assert.equal(res.body['error'], 'NotFound')
  })

  test('404 — token con formato inválido', async () => {
    const res = await api.get('/invitaciones/no-es-uuid')
    assert.equal(res.status, 404)
  })
})
