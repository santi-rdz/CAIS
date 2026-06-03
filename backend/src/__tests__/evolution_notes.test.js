import request from 'supertest'
import app from '#app'
import { loginAs } from './helpers/auth.js'
import { NIL_UUID } from './helpers/constants.js'
import { getAnyPatientId } from './helpers/fixtures.js'
import { buildEvolutionNote } from './helpers/factories.js'

const api = request(app)
let agent
let pacienteId

beforeAll(async () => {
  agent = await loginAs('coordMedicina')
  pacienteId = await getAnyPatientId(agent)
})

describe('GET /medicina/notas-evolucion', () => {
  test('401 — sin sesión', async () => {
    const res = await api.get('/medicina/notas-evolucion')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada { notes, count }', async () => {
    const res = await agent.get('/medicina/notas-evolucion')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.notes)).toBe(true)
    expect(typeof res.body.count).toBe('number')
  })

  test('200 — respeta limit', async () => {
    const res = await agent.get('/medicina/notas-evolucion?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(res.body.notes.length).toBeLessThanOrEqual(2)
  })

  // El listado devuelve un shape mínimo (sin paciente_id) — para verificar el
  // filtro se crea una nota propia y se comprueba que aparece en la respuesta filtrada.
  test('200 — filtra por paciente_id', async () => {
    const created = await agent
      .post('/medicina/notas-evolucion')
      .send(buildEvolutionNote({ pacienteId }, { motivo_consulta: 'Filtro paciente_id' }))
    const noteId = created.body.note?.id

    try {
      const res = await agent.get(
        `/medicina/notas-evolucion?paciente_id=${pacienteId}&page=1&limit=20`
      )
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.notes)).toBe(true)
      expect(res.body.notes.some((n) => n.id === noteId)).toBe(true)
    } finally {
      if (noteId) await agent.delete(`/medicina/notas-evolucion/${noteId}`).catch(() => {})
    }
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
    const res = await api.post('/medicina/notas-evolucion').send(buildEvolutionNote({ pacienteId }))
    expect(res.status).toBe(401)
  })

  test('422 — body vacío', async () => {
    const res = await agent.post('/medicina/notas-evolucion').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — paciente_id no es UUID', async () => {
    const res = await agent.post('/medicina/notas-evolucion').send({ paciente_id: 'no-es-uuid' })
    expect(res.status).toBe(422)
  })

  test('201 — crea nota de evolución', async () => {
    const res = await agent
      .post('/medicina/notas-evolucion')
      .send(buildEvolutionNote({ pacienteId }))

    expect(res.status).toBe(201)
    expect(res.body.note.id).toBeDefined()
    expect(res.body.note.paciente_id).toBe(pacienteId)

    await agent.delete(`/medicina/notas-evolucion/${res.body.note.id}`).catch(() => {})
  })
})

describe('PATCH /medicina/notas-evolucion/:id', () => {
  let noteId

  beforeAll(async () => {
    const res = await agent
      .post('/medicina/notas-evolucion')
      .send(buildEvolutionNote({ pacienteId }, { motivo_consulta: 'Nota para patch' }))
    noteId = res.body.note?.id
    if (!noteId) throw new Error(`No se pudo crear nota para PATCH. status=${res.status}`)
  })

  afterAll(async () => {
    if (noteId) await agent.delete(`/medicina/notas-evolucion/${noteId}`).catch(() => {})
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
      .send(buildEvolutionNote({ pacienteId }, { motivo_consulta: 'Nota para delete' }))
    noteId = res.body.note?.id
    if (!noteId) throw new Error(`No se pudo crear nota para DELETE. status=${res.status}`)
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
    noteId = null
  })
})
