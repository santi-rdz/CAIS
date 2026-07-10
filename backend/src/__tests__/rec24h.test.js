/**
 * @file Tests de integración para el recordatorio de 24 horas.
 *
 * A diferencia de biochemicalEval/anthropometricEval (perfiles 1:1), aquí
 * `rec_24h_comidas` es una lista 1:N por cada cita/recordatorio. El PATCH
 * reemplaza la lista completa cuando se envía `comidas` (ver
 * Rec24hModel.update) — no hace upsert por ítem.
 */

import request from 'supertest'
import app from '#app'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createTestPaciente } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let historiaId

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'NUTRICION', tracker })
  agent = auth.agent

  const paciente = await createTestPaciente({ doctor: auth.user, tracker })

  const histRes = await agent
    .post('/nutricion/historias-nutricion')
    .send({ paciente_id: paciente.id, motivo_consulta: 'Setup rec 24h' })
  historiaId = histRes.body.history?.id
  if (!historiaId) throw new Error(`No se pudo crear historia. status=${histRes.status}`)
  tracker.track('historias_pacientes_nutricion', uuidToBuffer(historiaId))
})

afterAll(() => tracker.cleanup())

const buildComida = (overrides = {}) => ({
  fecha: '2024-05-10',
  comida: 'Desayuno',
  alimento: 'Avena con fruta',
  calorias: 350,
  grasa: 8,
  colesterol: 0,
  sodio: 50,
  carb: 55,
  proteinas: 10,
  azucar: 12,
  fibra: 6,
  ...overrides,
})

const buildMinimal = (overrides = {}) => ({
  historia_paciente_id: historiaId,
  ...overrides,
})

const buildCompleto = (overrides = {}) => ({
  historia_paciente_id: historiaId,
  fecha_eval: '2024-05-10',
  comidas: [
    buildComida(),
    buildComida({ comida: 'Comida', alimento: 'Pollo con arroz', calorias: 550 }),
    buildComida({ comida: 'Cena', alimento: 'Ensalada con atún', calorias: 300 }),
  ],
  ...overrides,
})

describe('GET /nutricion/rec-24h', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/rec-24h')
    expect(res.status).toBe(401)
  })

  test('422 — rechaza si falta historia_paciente_id', async () => {
    const res = await agent.get('/nutricion/rec-24h')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent.get('/nutricion/rec-24h?historia_paciente_id=no-es-uuid')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get(`/nutricion/rec-24h?historia_paciente_id=${historiaId}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('recs')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.recs)).toBe(true)
  })

  test('200 — filtra por historia_paciente_id', async () => {
    const created = await agent.post('/nutricion/rec-24h').send(buildMinimal())
    expect(created.status).toBe(201)
    tracker.track('rec_24h_nutricion', uuidToBuffer(created.body.rec.id))

    const res = await agent.get(`/nutricion/rec-24h?historia_paciente_id=${historiaId}`)
    expect(res.status).toBe(200)
    expect(res.body.recs.length).toBeGreaterThan(0)
    for (const r of res.body.recs) {
      expect(r.historia_paciente_id).toBe(historiaId)
    }
  })
})

describe('GET /nutricion/rec-24h/:id', () => {
  test('404 — recordatorio no existe', async () => {
    const res = await agent.get('/nutricion/rec-24h/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

describe('POST /nutricion/rec-24h', () => {
  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/rec-24h').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/rec-24h')
      .send(buildMinimal({ historia_paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('422 — rechaza más de 50 comidas', async () => {
    const comidas = Array.from({ length: 51 }, () => buildComida())
    const res = await agent.post('/nutricion/rec-24h').send(buildMinimal({ comidas }))
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('201 — crea recordatorio sin comidas', async () => {
    const res = await agent.post('/nutricion/rec-24h').send(buildMinimal())
    expect(res.status).toBe(201)
    const r = res.body.rec
    expect(r.id).toBeDefined()
    expect(r.historia_paciente_id).toBe(historiaId)
    expect(r.paciente_id).toBeDefined()
    expect(r.rec_24h_comidas).toEqual([])

    tracker.track('rec_24h_nutricion', uuidToBuffer(r.id))
  })

  test('201 — crea recordatorio con comidas', async () => {
    const res = await agent.post('/nutricion/rec-24h').send(buildCompleto())
    expect(res.status).toBe(201)
    const r = res.body.rec
    expect(r.historia_paciente_id).toBe(historiaId)
    expect(r.rec_24h_comidas).toHaveLength(3)
    expect(r.rec_24h_comidas.map((c) => c.alimento)).toEqual(
      expect.arrayContaining(['Avena con fruta', 'Pollo con arroz', 'Ensalada con atún'])
    )

    tracker.track('rec_24h_nutricion', uuidToBuffer(r.id))
  })
})

describe('PATCH /nutricion/rec-24h/:id', () => {
  let recId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/rec-24h').send(buildCompleto())
    recId = res.body.rec?.id
    if (!recId) throw new Error(`No se pudo crear rec para PATCH. status=${res.status}`)
    tracker.track('rec_24h_nutricion', uuidToBuffer(recId))
  })

  test('200 — actualiza fecha_eval sin tocar las comidas', async () => {
    const res = await agent.patch(`/nutricion/rec-24h/${recId}`).send({ fecha_eval: '2024-06-01' })
    expect(res.status).toBe(200)
    expect(res.body.rec_24h_comidas).toHaveLength(3)
  })

  test('200 — reemplaza la lista completa de comidas', async () => {
    const res = await agent
      .patch(`/nutricion/rec-24h/${recId}`)
      .send({ comidas: [buildComida({ alimento: 'Yogurt con granola' })] })
    expect(res.status).toBe(200)
    expect(res.body.rec_24h_comidas).toHaveLength(1)
    expect(res.body.rec_24h_comidas[0].alimento).toBe('Yogurt con granola')
  })

  test('200 — vacía la lista de comidas', async () => {
    const res = await agent.patch(`/nutricion/rec-24h/${recId}`).send({ comidas: [] })
    expect(res.status).toBe(200)
    expect(res.body.rec_24h_comidas).toEqual([])
  })

  test('404 — recordatorio no existe', async () => {
    const res = await agent
      .patch('/nutricion/rec-24h/00000000-0000-0000-0000-000000000000')
      .send({ fecha_eval: '2024-06-01' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /nutricion/rec-24h/:id', () => {
  let recId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/rec-24h').send(buildCompleto())
    recId = res.body.rec?.id
    if (!recId) throw new Error(`No se pudo crear rec para DELETE. status=${res.status}`)
    tracker.track('rec_24h_nutricion', uuidToBuffer(recId))
  })

  test('404 — recordatorio no existe', async () => {
    const res = await agent.delete('/nutricion/rec-24h/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
  })

  test('200 — elimina el recordatorio y sus comidas en cascada', async () => {
    const recBuffer = uuidToBuffer(recId)
    const res = await agent.delete(`/nutricion/rec-24h/${recId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()

    const check = await agent.get(`/nutricion/rec-24h/${recId}`)
    expect(check.status).toBe(404)

    const comidas = await prisma.rec_24h_comidas.findMany({ where: { rec_24h_id: recBuffer } })
    expect(comidas).toHaveLength(0)
  })
})
