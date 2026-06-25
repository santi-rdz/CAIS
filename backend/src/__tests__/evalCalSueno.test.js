/**
 * @file Tests de integración para el CRUD de evaluación de calidad del sueño.
 *
 * Verifica listado, filtros por historia, creación, actualización y
 * eliminación en /nutricion/evaluacion-sueno. El recurso enlaza a una historia
 * de paciente de nutrición (FK historia_paciente_id).
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

  // Los hijos eval_cal_sueno se limpian vía el pre-step de la historia tracked.
  const histRes = await agent
    .post('/nutricion/historias-nutricion')
    .send({ paciente_id: pacienteId, motivo_consulta: 'Setup eval sueño' })
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
  horas_sueno: 7,
  clasif_horas_sueno: '6-8 horas',
  insomnio: 'NO',
  medicacion: 'NO',
  ...overrides,
})

describe('GET /nutricion/evaluacion-sueno', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/evaluacion-sueno')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/nutricion/evaluacion-sueno')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('evaluaciones')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.evaluaciones)).toBe(true)
  })

  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/nutricion/evaluacion-sueno?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(res.body.evaluaciones.length).toBeLessThanOrEqual(2)
  })

  test('200 — filtra por historia_paciente_id', async () => {
    const created = await agent.post('/nutricion/evaluacion-sueno').send(buildMinimal())
    expect(created.status).toBe(201)

    const res = await agent.get(`/nutricion/evaluacion-sueno?historia_paciente_id=${historiaId}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.evaluaciones)).toBe(true)
    expect(res.body.evaluaciones.length).toBeGreaterThan(0)
    for (const e of res.body.evaluaciones) {
      expect(e.historia_paciente_id).toBe(historiaId)
    }
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent.get('/nutricion/evaluacion-sueno?historia_paciente_id=no-es-uuid')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza fields con valores no permitidos', async () => {
    const res = await agent.get('/nutricion/evaluacion-sueno?fields=insomnio,__proto__')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })
})

describe('GET /nutricion/evaluacion-sueno/:id', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/evaluacion-sueno/0')
    expect(res.status).toBe(401)
  })

  test('422 — rechaza id no entero positivo', async () => {
    const res = await agent.get('/nutricion/evaluacion-sueno/0')
    expect(res.status).toBe(422)
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent.get('/nutricion/evaluacion-sueno/999999')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

describe('POST /nutricion/evaluacion-sueno', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.post('/nutricion/evaluacion-sueno').send(buildMinimal())
    expect(res.status).toBe(401)
  })

  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/evaluacion-sueno').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/evaluacion-sueno')
      .send(buildMinimal({ historia_paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('422 — rechaza horas_sueno fuera de rango', async () => {
    const res = await agent
      .post('/nutricion/evaluacion-sueno')
      .send(buildMinimal({ horas_sueno: 200 }))
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('201 — crea evaluación mínima', async () => {
    const res = await agent.post('/nutricion/evaluacion-sueno').send(buildMinimal())
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('evaluacion')
    const e = res.body.evaluacion
    expect(e.id).toBeDefined()
    expect(e.historia_paciente_id).toBe(historiaId)
    expect(e.paciente_id).toBe(pacienteId)
  })

  test('201 — crea evaluación con todos los campos', async () => {
    const res = await agent.post('/nutricion/evaluacion-sueno').send(buildCompleto())
    expect(res.status).toBe(201)
    const e = res.body.evaluacion
    expect(e.id).toBeDefined()
    expect(e.historia_paciente_id).toBe(historiaId)
    expect(e.horas_sueno).toBe(7)
    expect(e.clasif_horas_sueno).toBe('6-8 horas')
    expect(e.insomnio).toBe('NO')
    expect(e.medicacion).toBe('NO')
  })
})

describe('PATCH /nutricion/evaluacion-sueno/:id', () => {
  let evalId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/evaluacion-sueno').send(buildCompleto())
    evalId = res.body.evaluacion?.id
    if (!evalId) throw new Error(`No se pudo crear evaluación para PATCH. status=${res.status}`)
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.patch(`/nutricion/evaluacion-sueno/${evalId}`).send({ insomnio: 'SI' })
    expect(res.status).toBe(401)
  })

  test('200 — actualiza horas_sueno', async () => {
    const res = await agent.patch(`/nutricion/evaluacion-sueno/${evalId}`).send({ horas_sueno: 5 })
    expect(res.status).toBe(200)
    expect(res.body.horas_sueno).toBe(5)
  })

  test('200 — actualiza insomnio y medicacion', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-sueno/${evalId}`)
      .send({ insomnio: 'SI', medicacion: 'SI' })
    expect(res.status).toBe(200)
    expect(res.body.insomnio).toBe('SI')
    expect(res.body.medicacion).toBe('SI')
  })

  test('422 — rechaza horas_sueno fuera de rango', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-sueno/${evalId}`)
      .send({ horas_sueno: 200 })
    expect(res.status).toBe(422)
  })

  test('422 — rechaza historia_paciente_id en PATCH', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-sueno/${evalId}`)
      .send({ historia_paciente_id: historiaId, insomnio: 'NO' })
    expect(res.status).toBe(422)
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent.patch('/nutricion/evaluacion-sueno/999999').send({ insomnio: 'NO' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /nutricion/evaluacion-sueno/:id', () => {
  let evalId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/evaluacion-sueno').send(buildCompleto())
    evalId = res.body.evaluacion?.id
    if (!evalId) throw new Error(`No se pudo crear evaluación para DELETE. status=${res.status}`)
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.delete(`/nutricion/evaluacion-sueno/${evalId}`)
    expect(res.status).toBe(401)
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent.delete('/nutricion/evaluacion-sueno/999999')
    expect(res.status).toBe(404)
  })

  test('200 — elimina la evaluación', async () => {
    const res = await agent.delete(`/nutricion/evaluacion-sueno/${evalId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
    expect(res.body.historia_paciente_id).toBe(historiaId)
  })

  test('404 — confirma que ya no existe tras eliminar', async () => {
    const res = await agent.get(`/nutricion/evaluacion-sueno/${evalId}`)
    expect(res.status).toBe(404)
  })
})
