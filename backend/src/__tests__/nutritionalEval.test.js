/**
 * @file Tests de integración para el CRUD de evaluaciones nutricionales FH.
 * @description Verifica listado, filtros por paciente, creación (con y sin relaciones),
 * actualización y eliminación en /nutricion/evaluacion-nutricional. Todas las rutas requieren sesión.
 */

import request from 'supertest'
import app from '#app'
import assert from 'assert'

// ─── Setup ──────────────────────────────────────────────────────────

/** @type {import('supertest').Agent} Agente con sesión autenticada */
let agent

/** @type {string|undefined} ID de un paciente real obtenido de la base de datos */
let pacienteId

beforeAll(async () => {
  agent = request.agent(app)
  const loginRes = await agent.post('/auth/login').send({
    email: 'carlos.herrera@cais.com',
    password: '123',
  })
  expect(loginRes.status).toBe(200)

  const pacientesRes = await agent.get('/pacientes?page=1&limit=1')
  const items = pacientesRes.body.pacientes ?? pacientesRes.body.patients ?? pacientesRes.body
  pacienteId = Array.isArray(items) ? items[0]?.id : undefined
  expect(pacienteId).toBeDefined()
})

/**
 * Payload mínimo: solo campos de eval_nutr_fh, sin tablas relacionadas.
 */
function buildPayloadMinimal(overrides = {}) {
  return {
    paciente_id: pacienteId,
    sigue_dieta: false,
    tiene_alergia: false,
    cual_alergia: null,
    alimentos_disgusta: 'Brócoli',
    ...overrides,
  }
}

/**
 * Payload completo: incluye datos para las tres tablas relacionadas.
 */
function buildPayloadCompleto(overrides = {}) {
  return {
    ...buildPayloadMinimal(),
    eval_apetito_nutricion: {
      apetito: 'Normal',
      lleno: 'Rápido',
      sabor_comida: 'Bueno',
      comidas_al_dia: '3',
      puntaje_total: 10,
      clasif_alteracion_apetito: 'Sin alteración',
    },
    frec_consumo_alimentos_nutricion: {
      frutas: 'Diario',
      verduras_cocidas: 'Semanal',
      verduras_crudas: 'Diario',
      pescado: 'Quincenal',
      mariscos: 'Mensual',
      pollo: 'Semanal',
      carne_roja: 'Semanal',
      quesos: 'Semanal',
      huevo_entero: 'Diario',
      clara_huevo: 'Nunca',
      embutidos: 'Nunca',
      leguminosas: 'Semanal',
      tortilla_maiz: 'Diario',
      cant_tortilla_maiz: '3',
      tortilla_harina: 'Nunca',
      cant_tortilla_harina: '0',
      pan_de_caja: 'Nunca',
      galletas_industr: 'Nunca',
      pan_dulce: 'Semanal',
      cereal_de_caja: 'Nunca',
      frituras_papas: 'Nunca',
      birote_bolillo: 'Semanal',
      pastas_arroz: 'Semanal',
      aderezos_capsu: 'Nunca',
      comida_rapida: 'Mensual',
      grasa_animal: 'Nunca',
      grasa_vegetal: 'Diario',
      cafe_te: 'Diario',
      litros_al_dia_cafe_te: '1',
      bebida_az: 'Nunca',
      litros_al_dia_beb_az: '0',
      bebida_endul_art: 'Nunca',
      litros_al_dia_beb_endul: '0',
      leche_sin_az: 'Diario',
      litros_al_dia_leche_sin_az: '0.5',
      agua_simple: 'Diario',
      litros_al_dia_agua_simple: '2',
      agrega_sal_extra: 'No',
      cdas_al_dia_sal_extra: 0,
      agrega_azucar: 'No',
      cdas_sobres_al_dia_azucar: 0,
    },
    horarios_comida_nutricion: {
      hora_desayuno: '08:00',
      hora_comida: '14:00',
      hora_cena: '20:00',
      hora_colac_1: '11:00',
      hora_colac_2: '17:00',
      hora_colac_3: null,
      hora_despierto: '07:00',
      tipo_alimentacion: 'Omnívora',
      problemas_masticar: false,
      problemas_pasar_alimento: false,
      perdida_dientes: false,
      pensamientos_sobre_dieta: 'Me cuesta evitar el pan dulce',
    },
    ...overrides,
  }
}

// ─── GET /nutricion/evaluacion-nutricional ─────────────────────────────────────────────

/**
 * @description Suite para GET /nutricion/evaluacion-nutricional.
 * Verifica listado paginado, filtro por paciente y protección con auth.
 */
describe('GET /nutricion/evaluacion-nutricional', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get('/nutricion/evaluacion-nutricional')
    assert.equal(res.status, 401)
  })

  /**
   * @test Devuelve 200 con estructura { evals, count }.
   */
  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/nutricion/evaluacion-nutricional')
    assert.equal(res.status, 200)
    assert(res.body['evals'] !== undefined, 'property evals should exist')
    assert(res.body['count'] !== undefined, 'property count should exist')
    assert(Array.isArray(res.body.evals), 'evals should be an array')
  })

  /**
   * @test Con limit=2 devuelve como máximo 2 registros.
   */
  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/nutricion/evaluacion-nutricional?page=1&limit=2')
    assert.equal(res.status, 200)
    assert(res.body.evals.length <= 2, 'evals.length should be <= 2')
  })

  /**
   * @test Filtrando por paciente_id todos los resultados pertenecen a ese paciente.
   */
  test('200 — filtra por paciente_id', async () => {
    if (!pacienteId) return
    const res = await agent.get(`/nutricion/evaluacion-nutricional?paciente_id=${pacienteId}`)
    assert.equal(res.status, 200)
    assert(Array.isArray(res.body.evals), 'evals should be an array')
    for (const e of res.body.evals) {
      assert.equal(e.paciente_id, pacienteId)
    }
  })
})

// ─── GET /nutricion/evaluacion-nutricional/:id ─────────────────────────────────────────

/**
 * @description Suite para GET /nutricion/evaluacion-nutricional/:id.
 * Verifica obtención por ID, 404 y protección con auth.
 */
describe('GET /nutricion/evaluacion-nutricional/:id', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get(
      '/nutricion/evaluacion-nutricional/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 401)
  })

  /**
   * @test UUID inexistente devuelve 404 con propiedad message.
   */
  test('404 — evaluación no existe', async () => {
    const res = await agent.get(
      '/nutricion/evaluacion-nutricional/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })
})

// ─── POST /nutricion/evaluacion-nutricional ────────────────────────────────────────────

/**
 * @description Suite para POST /nutricion/evaluacion-nutricional.
 * Verifica creación sin relaciones, con todas las relaciones, validaciones y auth.
 */
describe('POST /nutricion/evaluacion-nutricional', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app)
      .post('/nutricion/evaluacion-nutricional')
      .send({ paciente_id: pacienteId })
    assert.equal(res.status, 401)
  })

  /**
   * @test Body vacío devuelve 422 ValidationError.
   */
  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/evaluacion-nutricional').send({})
    assert.equal(res.status, 422)
    assert.equal(res.body['error'], 'ValidationError')
  })

  /**
   * @test paciente_id que no es UUID devuelve 422.
   */
  test('422 — rechaza paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/evaluacion-nutricional')
      .send(buildPayloadMinimal({ paciente_id: 'no-es-uuid' }))
    assert.equal(res.status, 422)
  })

  /**
   * @test Payload sin tablas relacionadas crea el registro y devuelve 201.
   * Las propiedades de relaciones deben ser null (no fueron enviadas).
   */
  test('201 — crea evaluación sin relaciones', async () => {
    if (!pacienteId) return
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(buildPayloadMinimal())
    assert.equal(res.status, 201)
    assert(res.body['evaluation'] !== undefined, 'property eval should exist')
    const e = res.body.evaluation
    assert(e['id'] !== undefined, 'eval.id should exist')
    assert.equal(e.paciente_id, pacienteId)
    assert.equal(e.eval_apetito_nutricion, null)
    assert.equal(e.frec_consumo_alimentos_nutricion, null)
    assert.equal(e.horarios_comida_nutricion, null)

    // cleanup
    await agent.delete(`/nutricion/evaluacion-nutricional/${e.id}`).catch(() => {})
  })

  /**
   * @test Payload con las tres tablas relacionadas crea el registro y devuelve 201.
   * Cada relación debe retornarse como objeto con sus campos.
   */
  test('201 — crea evaluación con todas las relaciones', async () => {
    if (!pacienteId) return
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(buildPayloadCompleto())
    assert.equal(res.status, 201)
    assert(res.body['evaluation'] !== undefined, 'property eval should exist')
    const e = res.body.evaluation
    assert(e['id'] !== undefined, 'eval.id should exist')
    assert.equal(e.paciente_id, pacienteId)

    // eval_apetito_nutricion
    assert(
      e.eval_apetito_nutricion !== null && typeof e.eval_apetito_nutricion === 'object',
      'eval_apetito_nutricion should be an object'
    )
    assert(
      e.eval_apetito_nutricion['apetito'] !== undefined,
      'eval_apetito_nutricion.apetito should exist'
    )

    // frec_consumo_alimentos_nutricion
    assert(
      e.frec_consumo_alimentos_nutricion !== null &&
        typeof e.frec_consumo_alimentos_nutricion === 'object',
      'frec_consumo_alimentos_nutricion should be an object'
    )
    assert(
      e.frec_consumo_alimentos_nutricion['frutas'] !== undefined,
      'frec_consumo_alimentos_nutricion.frutas should exist'
    )

    // horarios_comida_nutricion
    assert(
      e.horarios_comida_nutricion !== null && typeof e.horarios_comida_nutricion === 'object',
      'horarios_comida_nutricion should be an object'
    )
    assert(
      e.horarios_comida_nutricion['hora_desayuno'] !== undefined,
      'horarios_comida_nutricion.hora_desayuno should exist'
    )

    // cleanup
    await agent.delete(`/nutricion/evaluacion-nutricional/${e.id}`).catch(() => {})
  })
})

// ─── PATCH /nutricion/evaluacion-nutricional/:id ───────────────────────────────────────

/**
 * @description Suite para PATCH /nutricion/evaluacion-nutricional/:id.
 * Verifica actualización de campos directos y de relaciones, 404 y auth.
 */
describe('PATCH /nutricion/evaluacion-nutricional/:id', () => {
  /** @type {string|undefined} ID de la evaluación creada en beforeAll */
  let evalId

  beforeAll(async () => {
    if (!pacienteId) return
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(buildPayloadCompleto())
    evalId = res.body.evaluation?.id
  })

  afterAll(async () => {
    if (evalId) await agent.delete(`/nutricion/evaluacion-nutricional/${evalId}`).catch(() => {})
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    if (!evalId) return
    const res = await request(app)
      .patch(`/nutricion/evaluacion-nutricional/${evalId}`)
      .send({ sigue_dieta: true })
    assert.equal(res.status, 401)
  })

  /**
   * @test Actualizar sigue_dieta devuelve 200 con el nuevo valor.
   */
  test('200 — actualiza campo directo sigue_dieta', async () => {
    if (!evalId) return
    const res = await agent
      .patch(`/nutricion/evaluacion-nutricional/${evalId}`)
      .send({ sigue_dieta: true })
    assert.equal(res.status, 200)
    assert.equal(res.body.evaluation.sigue_dieta, true)
  })

  /**
   * @test Actualizar eval_apetito_nutricion devuelve 200 con el campo actualizado.
   */
  test('200 — actualiza relación eval_apetito_nutricion', async () => {
    if (!evalId) return
    const res = await agent
      .patch(`/nutricion/evaluacion-nutricional/${evalId}`)
      .send({ eval_apetito_nutricion: { apetito: 'Disminuido' } })
    assert.equal(res.status, 200)
    assert.equal(res.body.evaluation.eval_apetito_nutricion?.apetito, 'Disminuido')
  })

  /**
   * @test Actualizar horarios_comida_nutricion devuelve 200 con el campo actualizado.
   */
  test('200 — actualiza relación horarios_comida_nutricion', async () => {
    if (!evalId) return
    const res = await agent
      .patch(`/nutricion/evaluacion-nutricional/${evalId}`)
      .send({ horarios_comida_nutricion: { hora_desayuno: '09:00' } })
    assert.equal(res.status, 200)
    assert.equal(res.body.evaluation.horarios_comida_nutricion?.hora_desayuno, '09:00')
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — evaluación no existe', async () => {
    const res = await agent
      .patch('/nutricion/evaluacion-nutricional/00000000-0000-0000-0000-000000000000')
      .send({ sigue_dieta: true })
    assert.equal(res.status, 404)
  })
})

// ─── DELETE /nutricion/evaluacion-nutricional/:id ──────────────────────────────────────

/**
 * @description Suite para DELETE /nutricion/evaluacion-nutricional/:id.
 * Verifica eliminación exitosa, 404 y protección con auth.
 */
describe('DELETE /nutricion/evaluacion-nutricional/:id', () => {
  /** @type {string|undefined} ID de la evaluación creada en beforeAll */
  let evalId

  beforeAll(async () => {
    if (!pacienteId) return
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(buildPayloadCompleto())
    evalId = res.body.evaluation?.id
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    if (!evalId) return
    const res = await request(app).delete(`/nutricion/evaluacion-nutricional/${evalId}`)
    assert.equal(res.status, 401)
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — evaluación no existe', async () => {
    const res = await agent.delete(
      '/nutricion/evaluacion-nutricional/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
  })

  /**
   * @test Evaluación existente se elimina y devuelve 200 con propiedad id.
   */
  test('200 — elimina la evaluación nutricional', async () => {
    if (!evalId) return
    const res = await agent.delete(`/nutricion/evaluacion-nutricional/${evalId}`)
    assert.equal(res.status, 200)
    assert(res.body['id'] !== undefined, 'property id should exist')
    evalId = null
  })
})
