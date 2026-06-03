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
import { buildNutritionalEvalMinimal, buildNutritionalEvalCompleto } from './helpers/factories.js'

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

const minimal = (overrides) => buildNutritionalEvalMinimal({ pacienteId }, overrides)
const completo = (overrides) => buildNutritionalEvalCompleto({ pacienteId }, overrides)

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
      .send(minimal({ paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('201 — crea evaluación sin relaciones', async () => {
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(minimal())
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
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(completo())
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
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(completo())
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
    const res = await agent.post('/nutricion/evaluacion-nutricional').send(completo())
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
