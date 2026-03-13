/**
 * @file Tests de integración para el CRUD de invitaciones de registro.
 * @description Verifica creación de invitaciones (requiere sesión con rol privilegiado)
 * y validación de tokens (ruta pública).
 */

import request from 'supertest'
import app from '#app'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import assert from 'assert'

// ─── Setup ──────────────────────────────────────────────────────────

/** @type {import('supertest').Agent} Agente con sesión autenticada como coordinador */
let agent

beforeAll(async () => {
  agent = request.agent(app)

  await agent.post('/auth/login').send({
    email: 'carlos.herrera@cais.com',
    password: '123',
  })
})

// ─── POST /invitaciones ─────────────────────────────────────────────

/**
 * @description Suite para POST /invitaciones.
 * Verifica creación individual y múltiple, validaciones y conflictos.
 * Requiere sesión con rol COORDINADOR o ADMIN.
 */
describe('POST /invitaciones', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app)
      .post('/invitaciones')
      .send([{ email: 'test@test.com', role: 'pasante' }])
    assert.equal(res.status, 401)
  })

  /**
   * @test Invitación con correo y rol válidos devuelve 201 con propiedad created.
   */
  test('201 — crea invitación válida', async () => {
    const correo = `inv.${Date.now()}@test.com`
    const res = await agent
      .post('/invitaciones')
      .send([{ email: correo, role: 'pasante' }])

    assert.equal(res.status, 201)
    assert(res.body['created'] !== undefined, 'property created should exist')

    await prisma.invitaciones_registro.deleteMany({ where: { correo } })
  })

  /**
   * @test Array con dos invitaciones válidas devuelve 201 con created=2.
   */
  test('201 — crea múltiples invitaciones', async () => {
    const correos = [
      { email: `multi1.${Date.now()}@test.com`, role: 'pasante' },
      { email: `multi2.${Date.now()}@test.com`, role: 'coordinador' },
    ]

    const res = await agent.post('/invitaciones').send(correos)

    assert.equal(res.status, 201)
    assert.equal(res.body.created, 2)

    await prisma.invitaciones_registro.deleteMany({
      where: { correo: { in: correos.map((c) => c.email) } },
    })
  })

  /**
   * @test Array vacío devuelve 422 ValidationError.
   */
  test('400 — rechaza array vacío', async () => {
    const res = await agent.post('/invitaciones').send([])

    assert.equal(res.status, 422)
    assert.equal(res.body['error'], 'ValidationError')
  })

  /**
   * @test Email con formato inválido devuelve 422.
   */
  test('400 — rechaza email inválido', async () => {
    const res = await agent
      .post('/invitaciones')
      .send([{ email: 'no-valido', role: 'pasante' }])

    assert.equal(res.status, 422)
  })

  /**
   * @test Rol no permitido (superadmin) devuelve 422.
   */
  test('400 — rechaza rol inválido', async () => {
    const res = await agent
      .post('/invitaciones')
      .send([{ email: 'test@test.com', role: 'superadmin' }])

    assert.equal(res.status, 422)
  })

  /**
   * @test Invitar un correo ya invitado devuelve 409.
   */
  test('409 — rechaza correo duplicado', async () => {
    const correo = `dup.inv.${Date.now()}@test.com`
    const payload = [{ email: correo, role: 'pasante' }]

    await agent.post('/invitaciones').send(payload)
    const res = await agent.post('/invitaciones').send(payload)

    assert.equal(res.status, 409)

    await prisma.invitaciones_registro.deleteMany({ where: { correo } })
  })
})

// ─── GET /invitaciones/:token ───────────────────────────────────────

/**
 * @description Suite para GET /invitaciones/:token.
 * Ruta pública usada por el flujo de auto-registro.
 * Verifica token válido, inexistente y con formato inválido.
 */
describe('GET /invitaciones/:token', () => {
  /** @type {string} Token UUID generado para las pruebas */
  let testToken

  /** @type {string} Correo asociado al token de prueba */
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

  /**
   * @test Token válido devuelve 200 con correo y rol correspondiente.
   */
  test('200 — retorna correo y rol para token válido', async () => {
    const res = await request(app).get(`/invitaciones/${testToken}`)
    assert.equal(res.status, 200)
    assert.equal(res.body['correo'], testCorreo)
    assert.equal(res.body['rol'], 'PASANTE')
  })

  /**
   * @test UUID válido pero no registrado devuelve 404 con error NotFound.
   */
  test('404 — token inexistente', async () => {
    const res = await request(app).get(
      '/invitaciones/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
    assert.equal(res.body['error'], 'NotFound')
  })

  /**
   * @test Token con formato distinto a UUID devuelve 404.
   */
  test('404 — token con formato inválido', async () => {
    const res = await request(app).get('/invitaciones/no-es-uuid')
    assert.equal(res.status, 404)
  })
})
