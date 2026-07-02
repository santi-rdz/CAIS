/**
 * @file Tests de integración para el CRUD de evaluaciones bioquímicas.
 *
 * Verifica listado, filtro por historia, creación y actualización con perfiles
 * 1:1 anidados (nested create/upsert de Prisma) y eliminación en cascada de los
 * perfiles en /nutricion/evaluacion-bioquimica.
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
let historiaId

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'NUTRICION', tracker })
  agent = auth.agent

  const paciente = await createTestPaciente({ doctor: auth.user, tracker })
  pacienteId = paciente.id

  // Las evaluaciones cuelgan de una historia de nutrición (FK
  // historia_paciente_id); se limpian vía el pre-step de la historia tracked.
  const histRes = await agent
    .post('/nutricion/historias-nutricion')
    .send({ paciente_id: pacienteId, motivo_consulta: 'Setup eval bioquímica' })
  historiaId = histRes.body.history?.id
  if (!historiaId) throw new Error(`No se pudo crear historia. status=${histRes.status}`)
  tracker.track('historias_pacientes_nutricion', uuidToBuffer(historiaId))
})

afterAll(() => tracker.cleanup())

const buildMinimal = (overrides = {}) => ({
  historia_paciente_id: historiaId,
  ...overrides,
})

const buildCompleto = (overrides = {}) => ({
  historia_paciente_id: historiaId,
  fecha: '2024-05-10',
  perfil_lipidos: { colesterol: 180, c_hdl: 50, c_ldl: 100, trigliceridos: 150 },
  balance_acido_base: { ph_serico: 7.4, saturacion_o2: 98, bicarbonato: 24, pco2_total: 40 },
  perfil_endocrino: { glucosa: 90, hbAlc: 5.4, insulina: 8 },
  ...overrides,
})

describe('GET /nutricion/evaluacion-bioquimica', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/evaluacion-bioquimica')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/nutricion/evaluacion-bioquimica')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('evaluations')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.evaluations)).toBe(true)
  })

  test('200 — filtra por historia_paciente_id', async () => {
    const created = await agent.post('/nutricion/evaluacion-bioquimica').send(buildMinimal())
    expect(created.status).toBe(201)
    tracker.track('eval_bioq_nutricion', uuidToBuffer(created.body.evaluation.id))

    const res = await agent.get(
      `/nutricion/evaluacion-bioquimica?historia_paciente_id=${historiaId}`
    )
    expect(res.status).toBe(200)
    expect(res.body.evaluations.length).toBeGreaterThan(0)
    for (const e of res.body.evaluations) {
      expect(e.historia_paciente_id).toBe(historiaId)
    }
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent.get('/nutricion/evaluacion-bioquimica?historia_paciente_id=no-es-uuid')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })
})

describe('GET /nutricion/evaluacion-bioquimica/:id', () => {
  test('404 — evaluación no existe', async () => {
    const res = await agent.get(
      '/nutricion/evaluacion-bioquimica/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

describe('POST /nutricion/evaluacion-bioquimica', () => {
  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/evaluacion-bioquimica').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/evaluacion-bioquimica')
      .send(buildMinimal({ historia_paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('201 — crea evaluación sin perfiles', async () => {
    const res = await agent.post('/nutricion/evaluacion-bioquimica').send(buildMinimal())
    expect(res.status).toBe(201)
    const e = res.body.evaluation
    expect(e.id).toBeDefined()
    expect(e.paciente_id).toBe(pacienteId)
    expect(e.perfil_lipidos).toBeNull()
    expect(e.balance_acido_base).toBeNull()

    tracker.track('eval_bioq_nutricion', uuidToBuffer(e.id))
  })

  test('201 — crea evaluación con perfiles anidados', async () => {
    const res = await agent.post('/nutricion/evaluacion-bioquimica').send(buildCompleto())
    expect(res.status).toBe(201)
    const e = res.body.evaluation
    expect(e.paciente_id).toBe(pacienteId)
    expect(e.perfil_lipidos).not.toBeNull()
    expect(e.perfil_lipidos.colesterol).toBe(180)
    expect(e.balance_acido_base.ph_serico).toBe(7.4)
    expect(e.perfil_endocrino.glucosa).toBe(90)

    tracker.track('eval_bioq_nutricion', uuidToBuffer(e.id))
  })
})

describe('PATCH /nutricion/evaluacion-bioquimica/:id', () => {
  let evalId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/evaluacion-bioquimica').send(buildCompleto())
    evalId = res.body.evaluation?.id
    if (!evalId) throw new Error(`No se pudo crear eval para PATCH. status=${res.status}`)
    tracker.track('eval_bioq_nutricion', uuidToBuffer(evalId))
  })

  test('200 — actualiza un perfil existente (upsert update)', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-bioquimica/${evalId}`)
      .send({ perfil_lipidos: { colesterol: 210, c_hdl: 45, c_ldl: 130, trigliceridos: 175 } })
    expect(res.status).toBe(200)
    expect(res.body.perfil_lipidos.colesterol).toBe(210)
  })

  test('200 — crea un perfil ausente (upsert create)', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-bioquimica/${evalId}`)
      .send({ perfil_inflamatorio: { pcr: 3.2, plaquetas: 250000 } })
    expect(res.status).toBe(200)
    expect(res.body.perfil_inflamatorio).not.toBeNull()
    expect(res.body.perfil_inflamatorio.pcr).toBe(3.2)
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent
      .patch('/nutricion/evaluacion-bioquimica/00000000-0000-0000-0000-000000000000')
      .send({ perfil_lipidos: { colesterol: 200 } })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /nutricion/evaluacion-bioquimica/:id', () => {
  let evalId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/evaluacion-bioquimica').send(buildCompleto())
    evalId = res.body.evaluation?.id
    if (!evalId) throw new Error(`No se pudo crear eval para DELETE. status=${res.status}`)
    tracker.track('eval_bioq_nutricion', uuidToBuffer(evalId))
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent.delete(
      '/nutricion/evaluacion-bioquimica/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
  })

  test('200 — elimina la evaluación y sus perfiles en cascada', async () => {
    const res = await agent.delete(`/nutricion/evaluacion-bioquimica/${evalId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()

    const check = await agent.get(`/nutricion/evaluacion-bioquimica/${evalId}`)
    expect(check.status).toBe(404)
  })
})
