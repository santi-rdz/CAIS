/**
 * @file Tests de integración para el CRUD de historias médicas.
 * @description Verifica listado, filtros por paciente, creación, actualización
 * y eliminación en /medicina/historias-medicas. Todas las rutas requieren sesión.
 */

import request from 'supertest'
import app from '#app'
import assert from 'assert'

// ─── Setup ──────────────────────────────────────────────────────────

/** @type {import('supertest').Agent} Agente con sesión autenticada */
let agent

/** @type {string|undefined} ID de un paciente real obtenido de la base de datos */
let pacienteId

/** @type {string|undefined} ID del usuario autenticado */
let usuarioId

beforeAll(async () => {
  agent = request.agent(app)

  await agent.post('/auth/login').send({
    email: 'carlos.herrera@cais.com',
    password: '123',
  })

  const [pacientesRes, meRes] = await Promise.all([
    agent.get('/pacientes?page=1&limit=1'),
    agent.get('/auth/me'),
  ])

  const items =
    pacientesRes.body.pacientes ?? pacientesRes.body.patients ?? pacientesRes.body
  pacienteId = Array.isArray(items) ? items[0]?.id : undefined
  usuarioId = meRes.body?.id
})

/** Builds a full valid payload for POST /medicina/historias-medicas */
function buildPayload(overrides = {}) {
  return {
    paciente_id: pacienteId,
    tipo_sangre: 'O+',
    vacunas_infancia_completas: true,
    motivo_consulta: 'Consulta de prueba',
    historia_enfermedad_actual: 'Sin antecedentes relevantes',
    antecedentes_familiares: { padre: 'Hipertensión' },
    antecedentes_patologicos: { cronico_degenerativos: 'Ninguno' },
    antecedentes_no_patologicos: {
      alimentacion_adecuada: true,
      calidad_cantidad_alimentacion: 'Adecuada',
      higiene_adecuada: true,
      inmunizaciones_completas: true,
      zoonosis: false,
      tipo_zoonosis: 'Ninguna',
    },
    aparatos_sistemas: { neurologico: 'Normal' },
    informacion_fisica: {
      peso: 70,
      altura: 1.75,
      pa_sistolica: 120,
      pa_diastolica: 80,
      fc: 72,
      fr: 16,
      circ_cintura: 85,
      circ_cadera: 95,
      sp_o2: 98,
      glucosa_capilar: 90,
      temperatura: 36.6,
    },
    inmunizaciones: {},
    planes_estudio: { usuario_id: usuarioId },
    servicios: { agua: true },
    ...overrides,
  }
}

// ─── GET /medicina/historias-medicas ─────────────────────────────────────────

/**
 * @description Suite para GET /medicina/historias-medicas.
 * Verifica listado paginado, filtro por paciente y protección con auth.
 */
describe('GET /medicina/historias-medicas', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get('/medicina/historias-medicas')
    assert.equal(res.status, 401)
  })

  /**
   * @test Devuelve 200 con estructura { histories, count }.
   */
  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/medicina/historias-medicas')
    assert.equal(res.status, 200)
    assert(res.body['histories'] !== undefined, 'property histories should exist')
    assert(res.body['count'] !== undefined, 'property count should exist')
    assert(Array.isArray(res.body.histories), 'histories should be an array')
  })

  /**
   * @test Con limit=2 devuelve como máximo 2 historias.
   */
  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/medicina/historias-medicas?page=1&limit=2')
    assert.equal(res.status, 200)
    assert(res.body.histories.length <= 2, 'histories.length should be <= 2')
  })

  /**
   * @test Filtrando por paciente_id todos los resultados pertenecen a ese paciente.
   */
  test('200 — filtra por paciente_id', async () => {
    if (!pacienteId) return
    const res = await agent.get(
      `/medicina/historias-medicas?paciente_id=${pacienteId}`
    )
    assert.equal(res.status, 200)
    assert(Array.isArray(res.body.histories), 'histories should be an array')
    for (const h of res.body.histories) {
      assert.equal(h.paciente_id, pacienteId)
    }
  })
})

// ─── GET /medicina/historias-medicas/:id ─────────────────────────────────────

/**
 * @description Suite para GET /medicina/historias-medicas/:id.
 * Verifica obtención por ID, 404 y protección con auth.
 */
describe('GET /medicina/historias-medicas/:id', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get(
      '/medicina/historias-medicas/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 401)
  })

  /**
   * @test UUID inexistente devuelve 404 con propiedad message.
   */
  test('404 — historia no existe', async () => {
    const res = await agent.get(
      '/medicina/historias-medicas/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })
})

// ─── POST /medicina/historias-medicas ────────────────────────────────────────

/**
 * @description Suite para POST /medicina/historias-medicas.
 * Verifica creación exitosa, validaciones y protección con auth.
 */
describe('POST /medicina/historias-medicas', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app)
      .post('/medicina/historias-medicas')
      .send({ paciente_id: pacienteId })
    assert.equal(res.status, 401)
  })

  /**
   * @test Body vacío devuelve 422 ValidationError.
   */
  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/medicina/historias-medicas').send({})
    assert.equal(res.status, 422)
    assert.equal(res.body['error'], 'ValidationError')
  })

  /**
   * @test paciente_id que no es UUID devuelve 422.
   */
  test('422 — rechaza paciente_id inválido', async () => {
    const res = await agent
      .post('/medicina/historias-medicas')
      .send(buildPayload({ paciente_id: 'no-es-uuid' }))
    assert.equal(res.status, 422)
  })

  /**
   * @test Datos válidos crean la historia y devuelven 201 con id y paciente_id.
   * Las relaciones de array (aparatos_sistemas, informacion_fisica, planes_estudio)
   * deben retornarse como arrays.
   */
  test('201 — crea historia médica con relaciones de array', async () => {
    if (!pacienteId || !usuarioId) return
    const res = await agent
      .post('/medicina/historias-medicas')
      .send(buildPayload())
    assert.equal(res.status, 201)
    assert(res.body['history'] !== undefined, 'property history should exist')
    const h = res.body.history
    assert(h['id'] !== undefined, 'history.id should exist')
    assert.equal(h.paciente_id, pacienteId)
    assert(Array.isArray(h.aparatos_sistemas), 'aparatos_sistemas should be an array')
    assert(Array.isArray(h.informacion_fisica), 'informacion_fisica should be an array')
    assert(Array.isArray(h.planes_estudio), 'planes_estudio should be an array')

    // cleanup
    await agent.delete(`/medicina/historias-medicas/${h.id}`).catch(() => {})
  })
})

// ─── PATCH /medicina/historias-medicas/:id ───────────────────────────────────

/**
 * @description Suite para PATCH /medicina/historias-medicas/:id.
 * Verifica actualización de campos, 404 y protección con auth.
 */
describe('PATCH /medicina/historias-medicas/:id', () => {
  /** @type {string|undefined} ID de la historia creada en beforeAll */
  let historyId

  beforeAll(async () => {
    if (!pacienteId || !usuarioId) return
    const res = await agent
      .post('/medicina/historias-medicas')
      .send(buildPayload())
    historyId = res.body.history?.id
  })

  afterAll(async () => {
    if (historyId)
      await agent
        .delete(`/medicina/historias-medicas/${historyId}`)
        .catch(() => {})
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    if (!historyId) return
    const res = await request(app)
      .patch(`/medicina/historias-medicas/${historyId}`)
      .send({ motivo_consulta: 'Sin auth' })
    assert.equal(res.status, 401)
  })

  /**
   * @test Actualizar motivo_consulta devuelve 200 con el nuevo valor.
   */
  test('200 — actualiza motivo_consulta', async () => {
    if (!historyId) return
    const res = await agent
      .patch(`/medicina/historias-medicas/${historyId}`)
      .send({ motivo_consulta: 'Motivo actualizado' })
    assert.equal(res.status, 200)
    assert.equal(res.body.motivo_consulta, 'Motivo actualizado')
  })

  /**
   * @test PATCH con aparatos_sistemas añade un nuevo elemento al array.
   */
  test('200 — añadir aparatos_sistemas agrega elemento al array', async () => {
    if (!historyId) return
    const before = await agent.get(`/medicina/historias-medicas/${historyId}`)
    const prevLen = before.body.aparatos_sistemas?.length ?? 0

    const res = await agent
      .patch(`/medicina/historias-medicas/${historyId}`)
      .send({ aparatos_sistemas: { cardiovascular: 'Normal' } })
    assert.equal(res.status, 200)
    assert(Array.isArray(res.body.aparatos_sistemas), 'aparatos_sistemas should be an array')
    assert.equal(res.body.aparatos_sistemas.length, prevLen + 1)
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — historia no existe', async () => {
    const res = await agent
      .patch('/medicina/historias-medicas/00000000-0000-0000-0000-000000000000')
      .send({ motivo_consulta: 'No existe' })
    assert.equal(res.status, 404)
  })
})

// ─── DELETE /medicina/historias-medicas/:id ──────────────────────────────────

/**
 * @description Suite para DELETE /medicina/historias-medicas/:id.
 * Verifica eliminación exitosa, 404 y protección con auth.
 */
describe('DELETE /medicina/historias-medicas/:id', () => {
  /** @type {string|undefined} ID de la historia creada en beforeAll */
  let historyId

  beforeAll(async () => {
    if (!pacienteId || !usuarioId) return
    const res = await agent
      .post('/medicina/historias-medicas')
      .send(buildPayload())
    historyId = res.body.history?.id
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    if (!historyId) return
    const res = await request(app).delete(
      `/medicina/historias-medicas/${historyId}`
    )
    assert.equal(res.status, 401)
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — historia no existe', async () => {
    const res = await agent.delete(
      '/medicina/historias-medicas/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
  })

  /**
   * @test Historia existente se elimina y devuelve 200 con propiedad id.
   */
  test('200 — elimina la historia médica', async () => {
    if (!historyId) return
    const res = await agent.delete(`/medicina/historias-medicas/${historyId}`)
    assert.equal(res.status, 200)
    assert(res.body['id'] !== undefined, 'property id should exist')
    historyId = null
  })
})
