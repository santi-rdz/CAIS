/**
 * @file Tests de integración para el CRUD de evaluaciones nutricionales FH.
 *
 * Verifica listado, filtros por paciente, creación (con y sin relaciones 1:1),
 * actualización y eliminación en /nutricion/evaluacion-nutricional.
 */

import request from 'supertest'
import app from '#app'
import { uuidToBuffer } from '#lib/uuid.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createTestPaciente } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let pacienteId

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'NUTRICION', tracker })
  agent = auth.agent

  const paciente = await createTestPaciente({ doctor: auth.user, tracker })
  pacienteId = paciente.id
})

afterAll(() => tracker.cleanup())

// ── Payload builders ────────────────────────────────────────────

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

// ── GET /nutricion/evaluacion-nutricional ──────────────────────────

describe('GET /nutricion/evaluacion-nutricional', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/evaluacion-nutricional')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/nutricion/evaluacion-nutricional')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('evals')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.evals)).toBe(true)
  })

  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/nutricion/evaluacion-nutricional?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(res.body.evals.length).toBeLessThanOrEqual(2)
  })

  test('200 — filtra por paciente_id', async () => {
    const res = await agent.get(`/nutricion/evaluacion-nutricional?paciente_id=${pacienteId}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.evals)).toBe(true)
    for (const e of res.body.evals) {
      expect(e.paciente_id).toBe(pacienteId)
    }
  })
})

// ── GET /nutricion/evaluacion-nutricional/:id ─────────────────────

describe('GET /nutricion/evaluacion-nutricional/:id', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get(
      '/nutricion/evaluacion-nutricional/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(401)
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent.get(
      '/nutricion/evaluacion-nutricional/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

// ── POST /nutricion/evaluacion-nutricional ────────────────────────

describe('POST /nutricion/evaluacion-nutricional', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api
      .post('/nutricion/evaluacion-nutricional')
      .send({ paciente_id: pacienteId })
    expect(res.status).toBe(401)
  })

  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/evaluacion-nutricional').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/evaluacion-nutricional')
      .send(buildPayloadMinimal({ paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('201 — crea evaluación sin relaciones', async () => {
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(buildPayloadMinimal())
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('evaluation')
    const e = res.body.evaluation
    expect(e.id).toBeDefined()
    expect(e.paciente_id).toBe(pacienteId)
    expect(e.eval_apetito_nutricion).toBeNull()
    expect(e.frec_consumo_alimentos_nutricion).toBeNull()
    expect(e.horarios_comida_nutricion).toBeNull()

    tracker.track('eval_nutr_fh', uuidToBuffer(e.id))
  })

  test('201 — crea evaluación con todas las relaciones', async () => {
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(buildPayloadCompleto())
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('evaluation')
    const e = res.body.evaluation
    expect(e.id).toBeDefined()
    expect(e.paciente_id).toBe(pacienteId)

    expect(e.eval_apetito_nutricion).not.toBeNull()
    expect(typeof e.eval_apetito_nutricion).toBe('object')
    expect(e.eval_apetito_nutricion.apetito).toBeDefined()

    expect(e.frec_consumo_alimentos_nutricion).not.toBeNull()
    expect(typeof e.frec_consumo_alimentos_nutricion).toBe('object')
    expect(e.frec_consumo_alimentos_nutricion.frutas).toBeDefined()

    expect(e.horarios_comida_nutricion).not.toBeNull()
    expect(typeof e.horarios_comida_nutricion).toBe('object')
    expect(e.horarios_comida_nutricion.hora_desayuno).toBeDefined()

    tracker.track('eval_nutr_fh', uuidToBuffer(e.id))
  })
})

// ── PATCH /nutricion/evaluacion-nutricional/:id ───────────────────

describe('PATCH /nutricion/evaluacion-nutricional/:id', () => {
  let evalId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(buildPayloadCompleto())
    evalId = res.body.evaluation?.id
    if (!evalId) throw new Error(`No se pudo crear eval para PATCH. status=${res.status}`)
    tracker.track('eval_nutr_fh', uuidToBuffer(evalId))
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api
      .patch(`/nutricion/evaluacion-nutricional/${evalId}`)
      .send({ sigue_dieta: true })
    expect(res.status).toBe(401)
  })

  test('200 — actualiza campo directo sigue_dieta', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-nutricional/${evalId}`)
      .send({ sigue_dieta: true })
    expect(res.status).toBe(200)
    expect(res.body.evaluation.sigue_dieta).toBe(true)
  })

  test('200 — actualiza relación eval_apetito_nutricion', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-nutricional/${evalId}`)
      .send({ eval_apetito_nutricion: { apetito: 'Disminuido' } })
    expect(res.status).toBe(200)
    expect(res.body.evaluation.eval_apetito_nutricion?.apetito).toBe('Disminuido')
  })

  test('200 — actualiza relación horarios_comida_nutricion', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-nutricional/${evalId}`)
      .send({ horarios_comida_nutricion: { hora_desayuno: '09:00' } })
    expect(res.status).toBe(200)
    expect(res.body.evaluation.horarios_comida_nutricion?.hora_desayuno).toBe('09:00')
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent
      .patch('/nutricion/evaluacion-nutricional/00000000-0000-0000-0000-000000000000')
      .send({ sigue_dieta: true })
    expect(res.status).toBe(404)
  })
})

// ── DELETE /nutricion/evaluacion-nutricional/:id ──────────────────

describe('DELETE /nutricion/evaluacion-nutricional/:id', () => {
  let evalId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(buildPayloadCompleto())
    evalId = res.body.evaluation?.id
    if (!evalId) throw new Error(`No se pudo crear eval para DELETE. status=${res.status}`)
    tracker.track('eval_nutr_fh', uuidToBuffer(evalId))
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.delete(`/nutricion/evaluacion-nutricional/${evalId}`)
    expect(res.status).toBe(401)
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent.delete(
      '/nutricion/evaluacion-nutricional/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
  })

  test('200 — elimina la evaluación nutricional', async () => {
    const res = await agent.delete(`/nutricion/evaluacion-nutricional/${evalId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
  })
})
