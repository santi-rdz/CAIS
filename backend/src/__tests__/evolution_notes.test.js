import request from 'supertest'
import app from '#app'
import { uuidToBuffer } from '#lib/uuid.js'
import { NIL_UUID } from './helpers/constants.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createTestPaciente } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'
import { buildEvolutionNote } from './helpers/factories.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let pacienteId
let historiaMedicaId

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'MEDICINA', tracker })
  agent = auth.agent

  const paciente = await createTestPaciente({ doctor: auth.user, tracker })
  pacienteId = paciente.id

  // Toda nota cuelga de una historia médica (FK historia_medica_id); se limpia
  // vía el cascade de la historia tracked.
  const histRes = await agent
    .post('/medicina/historias-medicas')
    .send({ paciente_id: pacienteId, motivo_consulta: 'Setup notas de evolución' })
  historiaMedicaId = histRes.body.history?.id
  if (!historiaMedicaId) throw new Error(`No se pudo crear historia. status=${histRes.status}`)
  tracker.track('historias_medicas', uuidToBuffer(historiaMedicaId))
})

afterAll(() => tracker.cleanup())

describe('GET /medicina/notas-evolucion', () => {
  test('401 — sin sesión', async () => {
    const res = await api.get('/medicina/notas-evolucion')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada { notes, count }', async () => {
    const res = await agent.get(`/medicina/notas-evolucion?historia_medica_id=${historiaMedicaId}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.notes)).toBe(true)
    expect(typeof res.body.count).toBe('number')
  })

  test('200 — respeta limit', async () => {
    const res = await agent.get(
      `/medicina/notas-evolucion?historia_medica_id=${historiaMedicaId}&page=1&limit=2`
    )
    expect(res.status).toBe(200)
    expect(res.body.notes.length).toBeLessThanOrEqual(2)
  })

  test('422 — rechaza listado sin historia_medica_id', async () => {
    const res = await agent.get('/medicina/notas-evolucion')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_medica_id inválido', async () => {
    const res = await agent.get('/medicina/notas-evolucion?historia_medica_id=no-es-uuid')
    expect(res.status).toBe(422)
  })

  test('200 — filtra por historia_medica_id', async () => {
    const created = await agent
      .post('/medicina/notas-evolucion')
      .send(buildEvolutionNote({ historiaMedicaId }, { motivo_consulta: 'Filtro historia' }))
    const noteId = created.body.note?.id
    tracker.track('notas_evolucion', uuidToBuffer(noteId))

    const res = await agent.get(
      `/medicina/notas-evolucion?historia_medica_id=${historiaMedicaId}&page=1&limit=20`
    )
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.notes)).toBe(true)
    expect(res.body.notes.some((n) => n.id === noteId)).toBe(true)
  })
})

describe('GET /medicina/notas-evolucion/:id', () => {
  test('401 — sin sesión', async () => {
    const res = await api.get(`/medicina/notas-evolucion/${NIL_UUID}`)
    expect(res.status).toBe(401)
  })

  test('404 — nota inexistente', async () => {
    const res = await agent.get(`/medicina/notas-evolucion/${NIL_UUID}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBeDefined()
  })
})

describe('POST /medicina/notas-evolucion', () => {
  test('401 — sin sesión', async () => {
    const res = await api
      .post('/medicina/notas-evolucion')
      .send(buildEvolutionNote({ historiaMedicaId }))
    expect(res.status).toBe(401)
  })

  test('422 — body vacío', async () => {
    const res = await agent.post('/medicina/notas-evolucion').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — historia_medica_id no es UUID', async () => {
    const res = await agent
      .post('/medicina/notas-evolucion')
      .send({ historia_medica_id: 'no-es-uuid' })
    expect(res.status).toBe(422)
  })

  test('201 — crea nota de evolución', async () => {
    const res = await agent
      .post('/medicina/notas-evolucion')
      .send(buildEvolutionNote({ historiaMedicaId }))

    expect(res.status).toBe(201)
    expect(res.body.note.id).toBeDefined()
    expect(res.body.note.historia_medica_id).toBe(historiaMedicaId)
    expect(res.body.note.paciente_id).toBe(pacienteId)
    tracker.track('notas_evolucion', uuidToBuffer(res.body.note.id))
  })
})

describe('PATCH /medicina/notas-evolucion/:id', () => {
  let noteId

  beforeAll(async () => {
    const res = await agent
      .post('/medicina/notas-evolucion')
      .send(buildEvolutionNote({ historiaMedicaId }, { motivo_consulta: 'Nota para patch' }))
    noteId = res.body.note?.id
    if (!noteId) throw new Error(`No se pudo crear nota para PATCH. status=${res.status}`)
    tracker.track('notas_evolucion', uuidToBuffer(noteId))
  })

  test('401 — sin sesión', async () => {
    const res = await api
      .patch(`/medicina/notas-evolucion/${noteId}`)
      .send({ motivo_consulta: 'Sin auth' })
    expect(res.status).toBe(401)
  })

  test('200 — actualiza motivo_consulta', async () => {
    const res = await agent
      .patch(`/medicina/notas-evolucion/${noteId}`)
      .send({ motivo_consulta: 'Motivo actualizado' })
    expect(res.status).toBe(200)
    expect(res.body.motivo_consulta).toBe('Motivo actualizado')
  })

  test('404 — nota inexistente', async () => {
    const res = await agent
      .patch(`/medicina/notas-evolucion/${NIL_UUID}`)
      .send({ motivo_consulta: 'No existe' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /medicina/notas-evolucion/:id', () => {
  let noteId

  beforeAll(async () => {
    const res = await agent
      .post('/medicina/notas-evolucion')
      .send(buildEvolutionNote({ historiaMedicaId }, { motivo_consulta: 'Nota para delete' }))
    noteId = res.body.note?.id
    if (!noteId) throw new Error(`No se pudo crear nota para DELETE. status=${res.status}`)
    tracker.track('notas_evolucion', uuidToBuffer(noteId))
  })

  test('401 — sin sesión', async () => {
    const res = await api.delete(`/medicina/notas-evolucion/${noteId}`)
    expect(res.status).toBe(401)
  })

  test('404 — nota inexistente', async () => {
    const res = await agent.delete(`/medicina/notas-evolucion/${NIL_UUID}`)
    expect(res.status).toBe(404)
  })

  test('200 — elimina y devuelve id', async () => {
    const res = await agent.delete(`/medicina/notas-evolucion/${noteId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
  })
})
