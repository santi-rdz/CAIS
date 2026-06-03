import request from 'supertest'
import app from '#app'
import { uuidToBuffer } from '#lib/uuid.js'
import { NIL_UUID } from './helpers/constants.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createCleanupTracker } from './helpers/cleanup.js'
import { buildEmergency } from './helpers/factories.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent

beforeAll(async () => {
  ;({ agent } = await authenticatedCoordinador({ area: 'MEDICINA', tracker }))
})

afterAll(() => tracker.cleanup())

describe('GET /medicina/emergencias', () => {
  test('401 — sin sesión', async () => {
    const res = await api.get('/medicina/emergencias')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada { emergencies, count }', async () => {
    const res = await agent.get('/medicina/emergencias')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.emergencies)).toBe(true)
    expect(typeof res.body.count).toBe('number')
  })

  test('200 — respeta limit', async () => {
    const res = await agent.get('/medicina/emergencias?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(res.body.emergencies.length).toBeLessThanOrEqual(2)
  })

  test('200 — filtra por recurrente=true', async () => {
    const res = await agent.get('/medicina/emergencias?recurrente=true')
    expect(res.status).toBe(200)
    for (const e of res.body.emergencies) {
      expect(e.recurrente).toBe(true)
    }
  })
})

describe('GET /medicina/emergencias/:id', () => {
  test('401 — sin sesión', async () => {
    const res = await api.get(`/medicina/emergencias/${NIL_UUID}`)
    expect(res.status).toBe(401)
  })

  test('404 — emergencia inexistente', async () => {
    const res = await agent.get(`/medicina/emergencias/${NIL_UUID}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBeDefined()
  })
})

describe('POST /medicina/emergencias', () => {
  test('401 — sin sesión', async () => {
    const res = await api.post('/medicina/emergencias').send(buildEmergency())
    expect(res.status).toBe(401)
  })

  test('422 — body vacío', async () => {
    const res = await agent.post('/medicina/emergencias').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('201 — crea emergencia', async () => {
    const payload = buildEmergency({ ubicacion: 'Laboratorio de prueba' })
    const res = await agent.post('/medicina/emergencias').send(payload)

    expect(res.status).toBe(201)
    expect(res.body.emergency.id).toBeDefined()
    expect(res.body.emergency.ubicacion).toBe(payload.ubicacion)
    expect(res.body.emergency.registrado_por).toBeDefined()

    tracker.track('bitacora_emergencias', uuidToBuffer(res.body.emergency.id))
  })
})

describe('PATCH /medicina/emergencias/:id', () => {
  let emergencyId

  beforeAll(async () => {
    const res = await agent
      .post('/medicina/emergencias')
      .send(buildEmergency({ ubicacion: 'Emergencia para patch' }))
    emergencyId = res.body.emergency?.id
    tracker.track('bitacora_emergencias', uuidToBuffer(emergencyId))
  })

  test('401 — sin sesión', async () => {
    const res = await api
      .patch(`/medicina/emergencias/${emergencyId}`)
      .send({ ubicacion: 'Sin auth' })
    expect(res.status).toBe(401)
  })

  test('200 — actualiza ubicacion', async () => {
    const res = await agent
      .patch(`/medicina/emergencias/${emergencyId}`)
      .send({ ubicacion: 'Ubicación actualizada' })
    expect(res.status).toBe(200)
    expect(res.body.ubicacion).toBe('Ubicación actualizada')
  })

  test('200 — actualiza recurrente', async () => {
    const res = await agent.patch(`/medicina/emergencias/${emergencyId}`).send({ recurrente: true })
    expect(res.status).toBe(200)
    expect(res.body.recurrente).toBe(true)
  })

  test('404 — emergencia inexistente', async () => {
    const res = await agent
      .patch(`/medicina/emergencias/${NIL_UUID}`)
      .send({ ubicacion: 'No existe' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /medicina/emergencias/:id', () => {
  let emergencyId

  beforeAll(async () => {
    const res = await agent
      .post('/medicina/emergencias')
      .send(buildEmergency({ ubicacion: 'Emergencia para delete' }))
    emergencyId = res.body.emergency?.id
    tracker.track('bitacora_emergencias', uuidToBuffer(emergencyId))
  })

  test('401 — sin sesión', async () => {
    const res = await api.delete(`/medicina/emergencias/${emergencyId}`)
    expect(res.status).toBe(401)
  })

  test('404 — emergencia inexistente', async () => {
    const res = await agent.delete(`/medicina/emergencias/${NIL_UUID}`)
    expect(res.status).toBe(404)
  })

  test('200 — elimina y devuelve id', async () => {
    const res = await agent.delete(`/medicina/emergencias/${emergencyId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(emergencyId)
  })
})
