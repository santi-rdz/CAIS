/**
 * @file Tests de integración para el CRUD de notas de evolución.
 * @description Verifica listado, filtros por paciente, creación, actualización
 * y eliminación en /medicina/notas-evolucion. Todas las rutas requieren sesión.
 */

import request from 'supertest'
import app from '../app.js'
import assert from 'assert'

// ─── Setup ──────────────────────────────────────────────────────────

/** @type {import('supertest').Agent} Agente con sesión autenticada */
let agent

/** @type {string|undefined} ID de un paciente real obtenido de la base de datos */
let pacienteId

beforeAll(async () => {
  agent = request.agent(app)

  await agent.post('/auth/login').send({
    email: 'carlos.herrera@cais.com',
    password: '123',
  })

  // Obtener un paciente real de la base de datos para usarlo en los tests
  const res = await agent.get('/pacientes?page=1&limit=1')
  const items = res.body.pacientes ?? res.body.patients ?? res.body
  pacienteId = Array.isArray(items) ? items[0]?.id : undefined
})

// ─── GET /medicina/notas-evolucion ────────────────────────────────────────────

/**
 * @description Suite para GET /medicina/notas-evolucion.
 * Verifica listado paginado, filtro por paciente y protección con auth.
 */
describe('GET /medicina/notas-evolucion', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get('/medicina/notas-evolucion')
    assert.equal(res.status, 401)
  })

  /**
   * @test Devuelve 200 con estructura { notes, count }.
   */
  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/medicina/notas-evolucion')
    assert.equal(res.status, 200)
    assert(res.body['notes'] !== undefined, 'property notes should exist')
    assert(res.body['count'] !== undefined, 'property count should exist')
    assert(Array.isArray(res.body.notes), 'notes should be an array')
  })

  /**
   * @test Con limit=2 devuelve como máximo 2 notas.
   */
  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/medicina/notas-evolucion?page=1&limit=2')
    assert.equal(res.status, 200)
    assert(res.body.notes.length <= 2, 'notes.length should be <= 2')
  })

  /**
   * @test Filtrando por paciente_id todos los resultados pertenecen a ese paciente.
   */
  test('200 — filtra por paciente_id', async () => {
    if (!pacienteId) return
    const res = await agent.get(
      `/medicina/notas-evolucion?paciente_id=${pacienteId}`
    )
    assert.equal(res.status, 200)
    assert(Array.isArray(res.body.notes), 'notes should be an array')
    for (const note of res.body.notes) {
      assert.equal(note.paciente_id, pacienteId)
    }
  })
})

// ─── GET /medicina/notas-evolucion/:id ────────────────────────────────────────

/**
 * @description Suite para GET /medicina/notas-evolucion/:id.
 * Verifica obtención por ID, 404 y protección con auth.
 */
describe('GET /medicina/notas-evolucion/:id', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get(
      '/medicina/notas-evolucion/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 401)
  })

  /**
   * @test UUID inexistente devuelve 404 con propiedad message.
   */
  test('404 — nota no existe', async () => {
    const res = await agent.get(
      '/medicina/notas-evolucion/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })
})

// ─── POST /medicina/notas-evolucion ───────────────────────────────────────────

/**
 * @description Suite para POST /medicina/notas-evolucion.
 * Verifica creación exitosa, validaciones y protección con auth.
 */
describe('POST /medicina/notas-evolucion', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app)
      .post('/medicina/notas-evolucion')
      .send({ paciente_id: pacienteId })
    assert.equal(res.status, 401)
  })

  /**
   * @test Body vacío devuelve 422 ValidationError.
   */
  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/medicina/notas-evolucion').send({})
    assert.equal(res.status, 422)
    assert.equal(res.body['error'], 'ValidationError')
  })

  /**
   * @test paciente_id que no es UUID devuelve 422.
   */
  test('422 — rechaza paciente_id inválido', async () => {
    const res = await agent
      .post('/medicina/notas-evolucion')
      .send({ paciente_id: 'no-es-uuid' })
    assert.equal(res.status, 422)
  })

  /**
   * @test Datos válidos crean la nota y devuelven 201 con id y paciente_id.
   */
  test('201 — crea nota de evolución', async () => {
    if (!pacienteId) return
    const res = await agent.post('/medicina/notas-evolucion').send({
      paciente_id: pacienteId,
      motivo_consulta: 'Dolor de cabeza',
      ant_gine_andro: 'Sin antecedentes',
    })
    assert.equal(res.status, 201)
    assert(res.body['note'] !== undefined, 'property note should exist')
    assert(res.body.note['id'] !== undefined, 'note.id should exist')
    assert.equal(res.body.note.paciente_id, pacienteId)

    // cleanup
    const id = res.body.note.id
    await agent.delete(`/medicina/notas-evolucion/${id}`).catch(() => {})
  })
})

// ─── PATCH /medicina/notas-evolucion/:id ──────────────────────────────────────

/**
 * @description Suite para PATCH /medicina/notas-evolucion/:id.
 * Verifica actualización de campos, 404 y protección con auth.
 */
describe('PATCH /medicina/notas-evolucion/:id', () => {
  /** @type {string|undefined} ID de la nota creada en beforeAll */
  let noteId

  beforeAll(async () => {
    if (!pacienteId) return
    const res = await agent.post('/medicina/notas-evolucion').send({
      paciente_id: pacienteId,
      motivo_consulta: 'Nota para patch',
    })
    noteId = res.body.note?.id
  })

  afterAll(async () => {
    if (noteId)
      await agent.delete(`/medicina/notas-evolucion/${noteId}`).catch(() => {})
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    if (!noteId) return
    const res = await request(app)
      .patch(`/medicina/notas-evolucion/${noteId}`)
      .send({ motivo_consulta: 'Sin auth' })
    assert.equal(res.status, 401)
  })

  /**
   * @test Actualizar motivo_consulta devuelve 200 con el nuevo valor.
   */
  test('200 — actualiza motivo_consulta', async () => {
    if (!noteId) return
    const res = await agent
      .patch(`/medicina/notas-evolucion/${noteId}`)
      .send({ motivo_consulta: 'Motivo actualizado' })
    assert.equal(res.status, 200)
    assert.equal(res.body.motivo_consulta, 'Motivo actualizado')
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — nota no existe', async () => {
    const res = await agent
      .patch('/medicina/notas-evolucion/00000000-0000-0000-0000-000000000000')
      .send({ motivo_consulta: 'No existe' })
    assert.equal(res.status, 404)
  })
})

// ─── DELETE /medicina/notas-evolucion/:id ─────────────────────────────────────

/**
 * @description Suite para DELETE /medicina/notas-evolucion/:id.
 * Verifica eliminación exitosa, 404 y protección con auth.
 */
describe('DELETE /medicina/notas-evolucion/:id', () => {
  /** @type {string|undefined} ID de la nota creada en beforeAll */
  let noteId

  beforeAll(async () => {
    if (!pacienteId) return
    const res = await agent.post('/medicina/notas-evolucion').send({
      paciente_id: pacienteId,
      motivo_consulta: 'Nota para delete',
    })
    noteId = res.body.note?.id
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    if (!noteId) return
    const res = await request(app).delete(
      `/medicina/notas-evolucion/${noteId}`
    )
    assert.equal(res.status, 401)
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — nota no existe', async () => {
    const res = await agent.delete(
      '/medicina/notas-evolucion/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
  })

  /**
   * @test Nota existente se elimina y devuelve 200 con propiedad id.
   */
  test('200 — elimina la nota', async () => {
    if (!noteId) return
    const res = await agent.delete(`/medicina/notas-evolucion/${noteId}`)
    assert.equal(res.status, 200)
    assert(res.body['id'] !== undefined, 'property id should exist')
    noteId = null
  })
})
