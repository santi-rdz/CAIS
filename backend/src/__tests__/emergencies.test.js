/**
 * @file Tests de integración para el CRUD de emergencias médicas.
 * @description Verifica listado, paginación, filtros, creación, actualización
 * y eliminación de registros en /medicina/emergencias. Todas las rutas requieren sesión.
 */

import request from 'supertest'
import app from '#app'
import assert from 'assert'

// ─── Setup ──────────────────────────────────────────────────────────

/** @type {import('supertest').Agent} Agente con sesión autenticada */
let agent

beforeAll(async () => {
  agent = request.agent(app)

  await agent.post('/auth/login').send({
    email: 'carlos.herrera@cais.com',
    password: '123',
  })
})

// ─── GET /medicina/emergencias ───────────────────────────────────────

/**
 * @description Suite para GET /medicina/emergencias.
 * Verifica listado paginado, filtros y protección con auth.
 */
describe('GET /medicina/emergencias', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get('/medicina/emergencias')
    assert.equal(res.status, 401)
  })

  /**
   * @test Devuelve 200 con estructura { emergencies, count }.
   */
  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/medicina/emergencias')
    assert.equal(res.status, 200)
    assert(
      res.body['emergencies'] !== undefined,
      'property emergencies should exist'
    )
    assert(res.body['count'] !== undefined, 'property count should exist')
    assert(
      Array.isArray(res.body.emergencies),
      'emergencies should be an array'
    )
  })

  /**
   * @test Con limit=2 devuelve como máximo 2 emergencias.
   */
  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/medicina/emergencias?page=1&limit=2')
    assert.equal(res.status, 200)
    assert(
      res.body.emergencies.length <= 2,
      'emergencies.length should be <= 2'
    )
  })

  /**
   * @test Filtrando por recurrente=true todos los resultados tienen recurrente true.
   */
  test('200 — filtra por recurrente=true', async () => {
    const res = await agent.get('/medicina/emergencias?recurrente=true')
    assert.equal(res.status, 200)
    for (const e of res.body.emergencies) {
      assert.equal(e.recurrente, true)
    }
  })
})

// ─── GET /medicina/emergencias/:id ──────────────────────────────────

/**
 * @description Suite para GET /medicina/emergencias/:id.
 * Verifica obtención por ID, 404 y protección con auth.
 */
describe('GET /medicina/emergencias/:id', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get(
      '/medicina/emergencias/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 401)
  })

  /**
   * @test UUID inexistente devuelve 404 con propiedad message.
   */
  test('404 — emergencia no existe', async () => {
    const res = await agent.get(
      '/medicina/emergencias/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })
})

// ─── POST /medicina/emergencias ──────────────────────────────────────

/**
 * @description Suite para POST /medicina/emergencias.
 * Verifica creación exitosa, validaciones y protección con auth.
 */
describe('POST /medicina/emergencias', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).post('/medicina/emergencias').send({
      ubicacion: 'Test',
      fecha_hora: new Date().toISOString(),
    })
    assert.equal(res.status, 401)
  })

  /**
   * @test Body vacío devuelve 422 ValidationError.
   */
  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/medicina/emergencias').send({})
    assert.equal(res.status, 422)
    assert.equal(res.body['error'], 'ValidationError')
  })

  /**
   * @test Datos válidos crean la emergencia y devuelven 201 con id, ubicacion y registrado_por.
   */
  test('201 — crea emergencia', async () => {
    const res = await agent.post('/medicina/emergencias').send({
      fecha_hora: new Date().toISOString(),
      ubicacion: 'Laboratorio de prueba',
      recurrente: false,
    })
    assert.equal(res.status, 201)
    assert(
      res.body['emergency'] !== undefined,
      'property emergency should exist'
    )
    assert(res.body.emergency['id'] !== undefined, 'emergency.id should exist')
    assert.equal(res.body.emergency.ubicacion, 'Laboratorio de prueba')
    assert(
      res.body.emergency['registrado_por'] !== undefined,
      'emergency.registrado_por should exist'
    )

    // cleanup
    const id = res.body.emergency.id
    await agent.delete(`/medicina/emergencias/${id}`).catch(() => {})
  })
})

// ─── PATCH /medicina/emergencias/:id ────────────────────────────────

/**
 * @description Suite para PATCH /medicina/emergencias/:id.
 * Verifica actualización de campos, 404 y protección con auth.
 */
describe('PATCH /medicina/emergencias/:id', () => {
  /** @type {string} ID de la emergencia de prueba creada en beforeAll */
  let emergencyId

  beforeAll(async () => {
    const res = await agent.post('/medicina/emergencias').send({
      fecha_hora: new Date().toISOString(),
      ubicacion: 'Emergencia para patch',
      recurrente: false,
    })
    emergencyId = res.body.emergency?.id
  })

  afterAll(async () => {
    if (emergencyId)
      await agent.delete(`/medicina/emergencias/${emergencyId}`).catch(() => {})
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    if (!emergencyId) return
    const res = await request(app)
      .patch(`/medicina/emergencias/${emergencyId}`)
      .send({ ubicacion: 'Sin auth' })
    assert.equal(res.status, 401)
  })

  /**
   * @test Actualizar ubicacion devuelve 200 con el nuevo valor.
   */
  test('200 — actualiza ubicacion', async () => {
    if (!emergencyId) return
    const res = await agent
      .patch(`/medicina/emergencias/${emergencyId}`)
      .send({ ubicacion: 'Ubicación actualizada' })
    assert.equal(res.status, 200)
    assert.equal(res.body.ubicacion, 'Ubicación actualizada')
  })

  /**
   * @test Actualizar recurrente a true devuelve 200 con recurrente true.
   */
  test('200 — actualiza recurrente', async () => {
    if (!emergencyId) return
    const res = await agent
      .patch(`/medicina/emergencias/${emergencyId}`)
      .send({ recurrente: true })
    assert.equal(res.status, 200)
    assert.equal(res.body.recurrente, true)
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — emergencia no existe', async () => {
    const res = await agent
      .patch('/medicina/emergencias/00000000-0000-0000-0000-000000000000')
      .send({ ubicacion: 'No existe' })
    assert.equal(res.status, 404)
  })
})

// ─── DELETE /medicina/emergencias/:id ────────────────────────────────

/**
 * @description Suite para DELETE /medicina/emergencias/:id.
 * Verifica eliminación exitosa, 404 y protección con auth.
 */
describe('DELETE /medicina/emergencias/:id', () => {
  /** @type {string} ID de la emergencia de prueba creada en beforeAll */
  let emergencyId

  beforeAll(async () => {
    const res = await agent.post('/medicina/emergencias').send({
      fecha_hora: new Date().toISOString(),
      ubicacion: 'Emergencia para delete',
    })
    emergencyId = res.body.emergency?.id
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    if (!emergencyId) return
    const res = await request(app).delete(
      `/medicina/emergencias/${emergencyId}`
    )
    assert.equal(res.status, 401)
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — emergencia no existe', async () => {
    const res = await agent.delete(
      '/medicina/emergencias/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
  })

  /**
   * @test Emergencia existente se elimina y devuelve 200 con el id eliminado.
   */
  test('200 — elimina la emergencia', async () => {
    if (!emergencyId) return
    const res = await agent.delete(`/medicina/emergencias/${emergencyId}`)
    assert.equal(res.status, 200)
    assert.equal(res.body.id, emergencyId)
  })
})
