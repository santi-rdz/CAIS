import request from 'supertest'
import app from '#app'
import { loginAs } from './helpers/auth.js'
import { NIL_UUID } from './helpers/constants.js'
import { getAnyPatientId, getCurrentUserId } from './helpers/fixtures.js'
import { buildMedicalHistory } from './helpers/factories.js'

const api = request(app)
let agent
let pacienteId
let usuarioId

beforeAll(async () => {
  agent = await loginAs('coordMedicina')
  ;[pacienteId, usuarioId] = await Promise.all([getAnyPatientId(agent), getCurrentUserId(agent)])
})

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
    if (!pacienteId) return
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
    if (!pacienteId || !usuarioId) return
    const res = await agent.post('/medicina/historias-medicas').send(payload())
    expect(res.status).toBe(201)

    const h = res.body.history
    expect(h.id).toBeDefined()
    expect(h.paciente_id).toBe(pacienteId)
    expect(h.aparatos_sistemas).toMatchObject({ neurologico: 'Normal' })
    expect(h.informacion_fisica).toMatchObject({ peso: 70 })
    expect(h.planes_estudio).toMatchObject({ cie10_codes: expect.any(Array) })

    await agent.delete(`/medicina/historias-medicas/${h.id}`).catch(() => {})
  })
})

describe('PATCH /medicina/historias-medicas/:id', () => {
  let historyId

  beforeAll(async () => {
    if (!pacienteId || !usuarioId) return
    const res = await agent.post('/medicina/historias-medicas').send(payload())
    historyId = res.body.history?.id
  })

  afterAll(async () => {
    if (historyId) await agent.delete(`/medicina/historias-medicas/${historyId}`).catch(() => {})
  })

  test('401 — sin sesión', async () => {
    if (!historyId) return
    const res = await api
      .patch(`/medicina/historias-medicas/${historyId}`)
      .send({ motivo_consulta: 'Sin auth' })
    expect(res.status).toBe(401)
  })

  test('200 — actualiza motivo_consulta', async () => {
    if (!historyId) return
    const res = await agent
      .patch(`/medicina/historias-medicas/${historyId}`)
      .send({ motivo_consulta: 'Motivo actualizado' })
    expect(res.status).toBe(200)
    expect(res.body.motivo_consulta).toBe('Motivo actualizado')
  })

  test('200 — PATCH actualiza aparatos_sistemas (relación 1:1, upsert)', async () => {
    if (!historyId) return
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

  // Usa payload mínimo (solo paciente_id) para evitar FKs con relaciones 1:1
  // que el delete del modelo no cascadea (onDelete: NoAction en el schema).
  beforeAll(async () => {
    if (!pacienteId || !usuarioId) return
    const res = await agent.post('/medicina/historias-medicas').send({ paciente_id: pacienteId })
    historyId = res.body.history?.id
  })

  test('401 — sin sesión', async () => {
    if (!historyId) return
    const res = await api.delete(`/medicina/historias-medicas/${historyId}`)
    expect(res.status).toBe(401)
  })

  test('404 — historia inexistente', async () => {
    const res = await agent.delete(`/medicina/historias-medicas/${NIL_UUID}`)
    expect(res.status).toBe(404)
  })

  test('200 — elimina y devuelve id', async () => {
    if (!historyId) return
    const res = await agent.delete(`/medicina/historias-medicas/${historyId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
    historyId = null
  })
})
