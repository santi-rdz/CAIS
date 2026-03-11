import request from 'supertest'
import app from '../app.js'
import assert from 'assert'

// ─── Setup ──────────────────────────────────────────────────────────

let agent
let pacienteId

beforeAll(async () => {
  agent = request.agent(app)

  await agent.post('/auth/login').send({
    email: 'carlos.herrera@cais.com',
    password: '123',
  })

  // Obtain a valid patient ID from the DB
  const res = await agent.get('/pacientes?page=1&limit=1')
  const items = res.body.pacientes ?? res.body.patients ?? res.body
  pacienteId = Array.isArray(items) ? items[0]?.id : undefined
})

// ─── GET /notas-evolucion ────────────────────────────────────────────

describe('GET /notas-evolucion', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get('/notas-evolucion')
    assert.equal(res.status, 401)
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/notas-evolucion')
    assert.equal(res.status, 200)
    assert(res.body['notes'] !== undefined, 'property notes should exist')
    assert(res.body['count'] !== undefined, 'property count should exist')
    assert(Array.isArray(res.body.notes), 'notes should be an array')
  })

  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/notas-evolucion?page=1&limit=2')
    assert.equal(res.status, 200)
    assert(res.body.notes.length <= 2, 'notes.length should be <= 2')
  })

  test('200 — filtra por paciente_id', async () => {
    if (!pacienteId) return
    const res = await agent.get(`/notas-evolucion?paciente_id=${pacienteId}`)
    assert.equal(res.status, 200)
    assert(Array.isArray(res.body.notes), 'notes should be an array')
    for (const note of res.body.notes) {
      assert.equal(note.paciente_id, pacienteId)
    }
  })
})

// ─── GET /notas-evolucion/:id ────────────────────────────────────────

describe('GET /notas-evolucion/:id', () => {
  test('404 — nota no existe', async () => {
    const res = await agent.get(
      '/notas-evolucion/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })
})

// ─── POST /notas-evolucion ───────────────────────────────────────────

describe('POST /notas-evolucion', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app)
      .post('/notas-evolucion')
      .send({ paciente_id: pacienteId })
    assert.equal(res.status, 401)
  })

  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/notas-evolucion').send({})
    assert.equal(res.status, 422)
    assert.equal(res.body['error'], 'ValidationError')
  })

  test('422 — rechaza paciente_id inválido', async () => {
    const res = await agent
      .post('/notas-evolucion')
      .send({ paciente_id: 'no-es-uuid' })
    assert.equal(res.status, 422)
  })

  test('201 — crea nota de evolución', async () => {
    if (!pacienteId) return
    const res = await agent.post('/notas-evolucion').send({
      paciente_id: pacienteId,
      motivo_consulta: 'Dolor de cabeza',
      ant_gine_andro: 'Sin antecedentes',
    })
    assert.equal(res.status, 201)
    assert(res.body['note'] !== undefined, 'property note should exist')
    assert(res.body.note['id'] !== undefined, 'note.id should exist')
    assert.equal(res.body.note.paciente_id, pacienteId)

    // cleanup
    const id = res.body.note.id
    await agent.delete(`/notas-evolucion/${id}`).catch(() => {})
  })
})

// ─── PATCH /notas-evolucion/:id ──────────────────────────────────────

describe('PATCH /notas-evolucion/:id', () => {
  let noteId

  beforeAll(async () => {
    if (!pacienteId) return
    const res = await agent.post('/notas-evolucion').send({
      paciente_id: pacienteId,
      motivo_consulta: 'Nota para patch',
    })
    noteId = res.body.note?.id
  })

  afterAll(async () => {
    if (noteId) await agent.delete(`/notas-evolucion/${noteId}`).catch(() => {})
  })

  test('200 — actualiza motivo_consulta', async () => {
    if (!noteId) return
    const res = await agent
      .patch(`/notas-evolucion/${noteId}`)
      .send({ motivo_consulta: 'Motivo actualizado' })
    assert.equal(res.status, 200)
    assert.equal(res.body.motivo_consulta, 'Motivo actualizado')
  })

  test('404 — nota no existe', async () => {
    const res = await agent
      .patch('/notas-evolucion/00000000-0000-0000-0000-000000000000')
      .send({ motivo_consulta: 'No existe' })
    assert.equal(res.status, 404)
  })

  test('401 — sin sesión devuelve 401', async () => {
    if (!noteId) return
    const res = await request(app)
      .patch(`/notas-evolucion/${noteId}`)
      .send({ motivo_consulta: 'Sin auth' })
    assert.equal(res.status, 401)
  })
})
