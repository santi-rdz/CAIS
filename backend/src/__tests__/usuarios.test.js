import request from 'supertest'
import app from '../app.js'
import { describe, test, expect, beforeAll, afterAll } from 'node:test'

const api = request(app)

// ─── GET /usuarios ──────────────────────────────────────────────────

describe('GET /usuarios', () => {
  test('200 — retorna lista paginada', async () => {
    const res = await api.get('/usuarios')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('users')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.users)).toBe(true)
  })

  test('200 — respeta parámetros de paginación', async () => {
    const res = await api.get('/usuarios?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(res.body.users.length).toBeLessThanOrEqual(2)
  })

  test('200 — filtra por status', async () => {
    const res = await api.get('/usuarios?status=ACTIVO')
    expect(res.status).toBe(200)
    for (const user of res.body.users) {
      expect(user.estado).toBe('ACTIVO')
    }
  })

  test('200 — busca por nombre o correo', async () => {
    const res = await api.get('/usuarios?search=carlos')
    expect(res.status).toBe(200)
  })

  test('200 — ordena por nombre ascendente', async () => {
    const res = await api.get('/usuarios?sortBy=nombre-asc')
    expect(res.status).toBe(200)
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
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', userId)
    expect(res.body).toHaveProperty('correo')
    expect(res.body).toHaveProperty('rol')
  })

  test('404 — usuario no existe', async () => {
    const res = await api.get('/usuarios/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
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
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('message', 'Usuario creado exitosamente')
    expect(res.body.usuario).toHaveProperty('id')
    expect(res.body.usuario.correo).toBe(pasanteValido.correo)

    // limpiar
    await api.delete(`/usuarios/${res.body.usuario.id}`)
  })

  test('201 — crea coordinador', async () => {
    const res = await api.post('/usuarios').send(coordValido)
    expect(res.status).toBe(201)
    expect(res.body.usuario).toHaveProperty('id')

    await api.delete(`/usuarios/${res.body.usuario.id}`)
  })

  test('422 — rechaza datos inválidos', async () => {
    const res = await api.post('/usuarios').send({ nombre: 'Solo nombre' })
    expect(res.status).toBe(422)
    expect(res.body).toHaveProperty('error', 'ValidationError')
  })

  test('422 — rechaza password corta', async () => {
    const res = await api
      .post('/usuarios')
      .send({ ...pasanteValido, password: '12' })
    expect(res.status).toBe(422)
  })

  test('409 — rechaza correo duplicado', async () => {
    const correo = `dup.${Date.now()}@test.com`
    const data = { ...pasanteValido, correo }

    const first = await api.post('/usuarios').send(data)
    expect(first.status).toBe(201)

    const second = await api.post('/usuarios').send(data)
    expect(second.status).toBe(409)
    expect(second.body).toHaveProperty('error', 'Conflict')

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
    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe('Nombre Actualizado')
  })

  test('404 — usuario no existe', async () => {
    const res = await api
      .patch('/usuarios/00000000-0000-0000-0000-000000000000')
      .send({ nombre: 'X' })
    expect(res.status).toBe(404)
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
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
  })

  test('404 — usuario no existe', async () => {
    const res = await api.delete(
      '/usuarios/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
  })
})
