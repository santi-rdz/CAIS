import request from 'supertest'
import app from '#app'
import { uuidToBuffer } from '#lib/uuid.js'
import { NIL_UUID } from './helpers/constants.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createTestPaciente } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'
import { buildMedicalHistory } from './helpers/factories.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let pacienteId // string UUID que ve la app
let usuarioId // string UUID del coordinador autenticado

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'MEDICINA', tracker })
  agent = auth.agent
  usuarioId = auth.user.id

  const paciente = await createTestPaciente({ doctor: auth.user, tracker })
  pacienteId = paciente.id
})

afterAll(() => tracker.cleanup())

function payload(overrides = {}) {
  return buildMedicalHistory({ pacienteId, usuarioId }, overrides)
}

describe('GET /medicina/historias-medicas', () => {
  test('401 — sin sesión', async () => {
    const res = await api.get('/medicina/historias-medicas')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada { histories, count }', async () => {
    const res = await agent.get('/medicina/historias-medicas')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.histories)).toBe(true)
    expect(typeof res.body.count).toBe('number')
  })

  test('200 — respeta limit', async () => {
    const res = await agent.get('/medicina/historias-medicas?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(res.body.histories.length).toBeLessThanOrEqual(2)
  })

  test('200 — filtra por paciente_id', async () => {
    const res = await agent.get(`/medicina/historias-medicas?paciente_id=${pacienteId}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.histories)).toBe(true)
    for (const h of res.body.histories) {
      expect(h.paciente_id).toBe(pacienteId)
    }
  })
})

describe('GET /medicina/historias-medicas/:id', () => {
  test('401 — sin sesión', async () => {
    const res = await api.get(`/medicina/historias-medicas/${NIL_UUID}`)
    expect(res.status).toBe(401)
  })

  test('404 — historia inexistente', async () => {
    const res = await agent.get(`/medicina/historias-medicas/${NIL_UUID}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBeDefined()
  })
})

describe('POST /medicina/historias-medicas', () => {
  test('401 — sin sesión', async () => {
    const res = await api.post('/medicina/historias-medicas').send({ paciente_id: pacienteId })
    expect(res.status).toBe(401)
  })

  test('422 — body vacío', async () => {
    const res = await agent.post('/medicina/historias-medicas').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — paciente_id no es UUID', async () => {
    const res = await agent
      .post('/medicina/historias-medicas')
      .send(payload({ paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('201 — crea historia con relaciones 1:1 anidadas', async () => {
    const res = await agent.post('/medicina/historias-medicas').send(payload())
    expect(res.status).toBe(201)

    const h = res.body.history
    expect(h.id).toBeDefined()
    expect(h.paciente_id).toBe(pacienteId)
    expect(h.aparatos_sistemas).toMatchObject({ neurologico: 'Normal' })
    expect(h.informacion_fisica).toMatchObject({ peso: 70 })
    expect(h.planes_estudio).toMatchObject({ cie10_codes: expect.any(Array) })

    // FK children cascade onDelete; solo necesitamos trackear la historia.
    tracker.track('historias_medicas', uuidToBuffer(h.id))
  })
})

describe('PATCH /medicina/historias-medicas/:id', () => {
  let historyId

  beforeAll(async () => {
    const res = await agent.post('/medicina/historias-medicas').send(payload())
    historyId = res.body.history?.id
    if (!historyId) throw new Error(`No se pudo crear historia para PATCH. status=${res.status}`)
    tracker.track('historias_medicas', uuidToBuffer(historyId))
  })

  test('401 — sin sesión', async () => {
    const res = await api
      .patch(`/medicina/historias-medicas/${historyId}`)
      .send({ motivo_consulta: 'Sin auth' })
    expect(res.status).toBe(401)
  })

  test('200 — actualiza motivo_consulta', async () => {
    const res = await agent
      .patch(`/medicina/historias-medicas/${historyId}`)
      .send({ motivo_consulta: 'Motivo actualizado' })
    expect(res.status).toBe(200)
    expect(res.body.motivo_consulta).toBe('Motivo actualizado')
  })

  test('200 — PATCH actualiza aparatos_sistemas (relación 1:1, upsert)', async () => {
    const res = await agent
      .patch(`/medicina/historias-medicas/${historyId}`)
      .send({ aparatos_sistemas: { cardiovascular: 'Normal' } })
    expect(res.status).toBe(200)
    expect(res.body.aparatos_sistemas).toMatchObject({ cardiovascular: 'Normal' })
  })

  test('404 — historia inexistente', async () => {
    const res = await agent
      .patch(`/medicina/historias-medicas/${NIL_UUID}`)
      .send({ motivo_consulta: 'No existe' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /medicina/historias-medicas/:id', () => {
  let historyId

  // Usa payload mínimo para mantener este caso enfocado en la eliminación de la historia.
  beforeAll(async () => {
    const res = await agent.post('/medicina/historias-medicas').send({ paciente_id: pacienteId })
    historyId = res.body.history?.id
    if (!historyId) throw new Error(`No se pudo crear historia para DELETE. status=${res.status}`)
    tracker.track('historias_medicas', uuidToBuffer(historyId))
  })

  test('401 — sin sesión', async () => {
    const res = await api.delete(`/medicina/historias-medicas/${historyId}`)
    expect(res.status).toBe(401)
  })

  test('404 — historia inexistente', async () => {
    const res = await agent.delete(`/medicina/historias-medicas/${NIL_UUID}`)
    expect(res.status).toBe(404)
  })

  test('200 — elimina y devuelve id', async () => {
    const res = await agent.delete(`/medicina/historias-medicas/${historyId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
    // Borrada via API; tracker.cleanup() en afterAll será no-op.
  })
})
