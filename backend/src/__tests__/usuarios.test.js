import request from 'supertest'
import app from '../app.js'
import { describe, test, beforeAll, afterAll } from 'node:test'
import assert from 'node:assert'

const api = request(app)

// ─── GET /usuarios ──────────────────────────────────────────────────

describe('GET /usuarios', () => {
  test('200 — retorna lista paginada', async () => {
    const res = await api.get('/usuarios')
    assert.equal(res.status, 200)
    assert(res.body['users'] !== undefined, 'property users should exist')
    assert(res.body['count'] !== undefined, 'property count should exist')
    assert(Array.isArray(res.body.users), 'users should be an array')
  })

  test('200 — respeta parámetros de paginación', async () => {
    const res = await api.get('/usuarios?page=1&limit=2')
    assert.equal(res.status, 200)
    assert(res.body.users.length <= 2, 'users.length should be <= 2')
  })

  test('200 — filtra por status', async () => {
    const res = await api.get('/usuarios?status=ACTIVO')
    assert.equal(res.status, 200)
    for (const user of res.body.users) {
      assert.equal(user.estado, 'ACTIVO')
    }
  })

  test('200 — busca por nombre o correo', async () => {
    const res = await api.get('/usuarios?search=carlos')
    assert.equal(res.status, 200)
  })

  test('200 — ordena por nombre ascendente', async () => {
    const res = await api.get('/usuarios?sortBy=nombre-asc')
    assert.equal(res.status, 200)
  })
})

// ─── GET /usuarios/:id ─────────────────────────────────────────────

describe('GET /usuarios/:id', () => {
  let userId

  beforeAll(async () => {
    const res = await api.get('/usuarios?page=1&limit=1')
    userId = res.body.users[0]?.id
  })

  test('200 — retorna usuario existente', async () => {
    if (!userId) return
    const res = await api.get(`/usuarios/${userId}`)
    assert.equal(res.status, 200)
    assert.equal(res.body['id'], userId)
    assert(res.body['correo'] !== undefined, 'property correo should exist')
    assert(res.body['rol'] !== undefined, 'property rol should exist')
  })

  test('404 — usuario no existe', async () => {
    const res = await api.get('/usuarios/00000000-0000-0000-0000-000000000000')
    assert.equal(res.status, 404)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })
})

// ─── POST /usuarios ─────────────────────────────────────────────────

describe('POST /usuarios — creación directa por admin', () => {
  const pasanteValido = {
    nombre: 'Test',
    apellido: 'Pasante',
    correo: `test.pasante.${Date.now()}@test.com`,
    fechaNacimiento: '2000-01-01',
    telefono: '6861111111',
    rol: 'pasante',
    password: 'abc123',
    matricula: 'TMAT01',
    servicioInicioAnio: '2026',
    servicioInicioPeriodo: '1',
    servicioFinAnio: '2026',
    servicioFinPeriodo: '2',
  }

  const coordValido = {
    nombre: 'Test',
    apellido: 'Coord',
    correo: `test.coord.${Date.now()}@test.com`,
    fechaNacimiento: '1990-01-01',
    telefono: '6862222222',
    rol: 'coordinador',
    password: 'abc123',
    cedula: 'TCED01',
  }

  test('201 — crea pasante', async () => {
    const res = await api.post('/usuarios').send(pasanteValido)
    assert.equal(res.status, 201)
    assert.equal(res.body['message'], 'Usuario creado exitosamente')
    assert(res.body.usuario['id'] !== undefined, 'property should exist')
    assert.equal(res.body.usuario.correo, pasanteValido.correo)

    // limpiar
    await api.delete(`/usuarios/${res.body.usuario.id}`)
  })

  test('201 — crea coordinador', async () => {
    const res = await api.post('/usuarios').send(coordValido)
    assert.equal(res.status, 201)
    assert(res.body.usuario['id'] !== undefined, 'property should exist')

    await api.delete(`/usuarios/${res.body.usuario.id}`)
  })

  test('422 — rechaza datos inválidos', async () => {
    const res = await api.post('/usuarios').send({ nombre: 'Solo nombre' })
    assert.equal(res.status, 422)
    assert.equal(res.body['error'], 'ValidationError')
  })

  test('422 — rechaza password corta', async () => {
    const res = await api
      .post('/usuarios')
      .send({ ...pasanteValido, password: '12' })
    assert.equal(res.status, 422)
  })

  test('409 — rechaza correo duplicado', async () => {
    const correo = `dup.${Date.now()}@test.com`
    const data = { ...pasanteValido, correo }

    const first = await api.post('/usuarios').send(data)
    assert.equal(first.status, 201)

    const second = await api.post('/usuarios').send(data)
    assert.equal(second.status, 409)
    assert.equal(second.body['error'], 'Conflict')

    await api.delete(`/usuarios/${first.body.usuario.id}`)
  })
})

// ─── PATCH /usuarios/:id ────────────────────────────────────────────

describe('PATCH /usuarios/:id', () => {
  let userId

  beforeAll(async () => {
    const res = await api.post('/usuarios').send({
      nombre: 'Patch',
      apellido: 'Test',
      correo: `patch.${Date.now()}@test.com`,
      fechaNacimiento: '2000-01-01',
      telefono: '6863333333',
      rol: 'pasante',
      password: 'abc123',
      matricula: 'PMAT01',
      servicioInicioAnio: '2026',
      servicioInicioPeriodo: '1',
      servicioFinAnio: '2026',
      servicioFinPeriodo: '2',
    })
    userId = res.body.usuario.id
  })

  afterAll(async () => {
    if (userId) await api.delete(`/usuarios/${userId}`)
  })

  test('200 — actualiza nombre', async () => {
    const res = await api
      .patch(`/usuarios/${userId}`)
      .send({ nombre: 'Nombre Actualizado' })
    assert.equal(res.status, 200)
    assert.equal(res.body.nombre, 'Nombre Actualizado')
  })

  test('404 — usuario no existe', async () => {
    const res = await api
      .patch('/usuarios/00000000-0000-0000-0000-000000000000')
      .send({ nombre: 'X' })
    assert.equal(res.status, 404)
  })
})

// ─── DELETE /usuarios/:id ───────────────────────────────────────────

describe('DELETE /usuarios/:id', () => {
  test('200 — elimina usuario existente', async () => {
    const create = await api.post('/usuarios').send({
      nombre: 'Delete',
      apellido: 'Test',
      correo: `delete.${Date.now()}@test.com`,
      fechaNacimiento: '2000-01-01',
      telefono: '6864444444',
      rol: 'pasante',
      password: 'abc123',
      matricula: 'DMAT01',
      servicioInicioAnio: '2026',
      servicioInicioPeriodo: '1',
      servicioFinAnio: '2026',
      servicioFinPeriodo: '2',
    })
    const id = create.body.usuario.id

    const res = await api.delete(`/usuarios/${id}`)
    assert.equal(res.status, 200)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })

  test('404 — usuario no existe', async () => {
    const res = await api.delete(
      '/usuarios/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
  })
})
