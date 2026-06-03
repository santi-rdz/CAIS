import request from 'supertest'
import app from '#app'
import { uuidToBuffer } from '#lib/uuid.js'
import { NIL_UUID } from './helpers/constants.js'
import { authenticatedAdmin } from './helpers/agents.js'
import { createTestCoordinador, createTestInvitation } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'
import { buildPasanteCreate, buildCoordCreate } from './helpers/factories.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let inviter // coordinador usado para crear invitaciones de prueba

beforeAll(async () => {
  ;({ agent } = await authenticatedAdmin({ tracker }))
  inviter = await createTestCoordinador({ tracker })
})

afterAll(() => tracker.cleanup())

describe('GET /usuarios', () => {
  test('401 — sin sesión', async () => {
    const res = await api.get('/usuarios')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada con shape { users, count }', async () => {
    const res = await agent.get('/usuarios')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.users)).toBe(true)
    expect(typeof res.body.count).toBe('number')
  })

  test('200 — respeta limit', async () => {
    const res = await agent.get('/usuarios?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(res.body.users.length).toBeLessThanOrEqual(2)
  })

  test('200 — filtra por status=ACTIVO', async () => {
    const res = await agent.get('/usuarios?status=ACTIVO')
    expect(res.status).toBe(200)
    for (const user of res.body.users) {
      expect(user.estado).toBe('ACTIVO')
    }
  })

  test('200 — sin filtro de status incluye invitaciones pendientes vigentes', async () => {
    const inv = await createTestInvitation({ invitedBy: inviter, tracker })
    const res = await agent.get('/usuarios')
    expect(res.status).toBe(200)
    expect(res.body.users.some((u) => u.correo === inv.correo)).toBe(true)
  })

  test('200 — búsqueda libre por texto', async () => {
    const res = await agent.get('/usuarios?search=test')
    expect(res.status).toBe(200)
  })

  test('200 — sortBy=nombre-asc', async () => {
    const res = await agent.get('/usuarios?sortBy=nombre-asc')
    expect(res.status).toBe(200)
  })

  test('200 — status=PENDIENTE devuelve invitaciones no expiradas', async () => {
    await createTestInvitation({ invitedBy: inviter, tracker })
    const res = await agent.get('/usuarios?status=PENDIENTE')
    expect(res.status).toBe(200)
    expect(res.body.count).toBeGreaterThanOrEqual(1)
    for (const user of res.body.users) {
      expect(user.estado).toBe('PENDIENTE')
      expect(user.correo).toBeDefined()
    }
  })

  test('200 — invitaciones expiradas no aparecen en pendientes', async () => {
    const expired = await createTestInvitation({
      invitedBy: inviter,
      expiresInMs: -1000,
      tracker,
    })
    const res = await agent.get('/usuarios?status=PENDIENTE')
    expect(res.status).toBe(200)
    expect(res.body.users.some((u) => u.correo === expired.correo)).toBe(false)
  })
})

describe('GET /usuarios/:id', () => {
  let targetUser

  beforeAll(async () => {
    targetUser = await createTestCoordinador({ tracker })
  })

  test('401 — sin sesión', async () => {
    const res = await api.get(`/usuarios/${NIL_UUID}`)
    expect(res.status).toBe(401)
  })

  test('200 — retorna usuario existente', async () => {
    const res = await agent.get(`/usuarios/${targetUser.id}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(targetUser.id)
    expect(res.body.correo).toBe(targetUser.correo)
    expect(res.body.rol).toBeDefined()
  })

  test('404 — usuario inexistente', async () => {
    const res = await agent.get(`/usuarios/${NIL_UUID}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBeDefined()
  })
})

describe('POST /usuarios — creación directa por admin', () => {
  test('401 — sin sesión', async () => {
    const res = await api.post('/usuarios').send(buildPasanteCreate())
    expect(res.status).toBe(401)
  })

  test('201 — crea pasante', async () => {
    const payload = buildPasanteCreate()
    const res = await agent.post('/usuarios').send(payload)
    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Usuario creado exitosamente')
    expect(res.body.usuario.id).toBeDefined()
    expect(res.body.usuario.correo).toBe(payload.correo)
    tracker.track('usuarios', uuidToBuffer(res.body.usuario.id))
  })

  test('201 — crea coordinador', async () => {
    const res = await agent.post('/usuarios').send(buildCoordCreate())
    expect(res.status).toBe(201)
    expect(res.body.usuario.id).toBeDefined()
    tracker.track('usuarios', uuidToBuffer(res.body.usuario.id))
  })

  test('422 — body sin campos requeridos', async () => {
    const res = await agent.post('/usuarios').send({ nombre: 'Solo nombre' })
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — password menor a 6 caracteres', async () => {
    const res = await agent.post('/usuarios').send(buildPasanteCreate({ password: '12345' }))
    expect(res.status).toBe(422)
  })

  test('201 — acepta password simple de 6+ caracteres (admin no exige complejidad)', async () => {
    const res = await agent.post('/usuarios').send(buildPasanteCreate({ password: '123456' }))
    expect(res.status).toBe(201)
    tracker.track('usuarios', uuidToBuffer(res.body.usuario.id))
  })

  test('409 — correo duplicado', async () => {
    const payload = buildPasanteCreate()
    const first = await agent.post('/usuarios').send(payload)
    expect(first.status).toBe(201)
    tracker.track('usuarios', uuidToBuffer(first.body.usuario.id))

    const second = await agent.post('/usuarios').send(payload)
    expect(second.status).toBe(409)
    expect(second.body.error).toBe('Conflict')
  })
})

describe('PATCH /usuarios/:id', () => {
  let userId

  beforeAll(async () => {
    const res = await agent.post('/usuarios').send(buildPasanteCreate({ matricula: 'PMAT01' }))
    userId = res.body.usuario.id
    tracker.track('usuarios', uuidToBuffer(userId))
  })

  test('401 — sin sesión', async () => {
    const res = await api.patch(`/usuarios/${NIL_UUID}`).send({ nombre: 'Sin auth' })
    expect(res.status).toBe(401)
  })

  test.each([
    ['nombre', { nombre: 'Nombre Actualizado' }],
    ['telefono', { telefono: '6861234567' }],
    ['matricula', { matricula: 'MAT-UPDATED' }],
  ])('200 — actualiza %s', async (field, payload) => {
    const res = await agent.patch(`/usuarios/${userId}`).send(payload)
    expect(res.status).toBe(200)
    expect(res.body[field]).toBe(payload[field])
  })

  test('200 — actualiza nombre y apellidos juntos', async () => {
    const res = await agent
      .patch(`/usuarios/${userId}`)
      .send({ nombre: 'Nuevo', apellidos: 'Apellido' })
    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe('Nuevo')
    expect(res.body.apellidos).toBe('Apellido')
  })

  test('404 — usuario inexistente', async () => {
    const res = await agent.patch(`/usuarios/${NIL_UUID}`).send({ nombre: 'No existe' })
    expect(res.status).toBe(404)
  })
})

describe('PATCH /usuarios/:id — estado', () => {
  let userId

  beforeAll(async () => {
    const res = await agent.post('/usuarios').send(buildPasanteCreate({ matricula: 'EMAT01' }))
    userId = res.body.usuario.id
    tracker.track('usuarios', uuidToBuffer(userId))
  })

  test('200 — desactiva (ACTIVO → INACTIVO)', async () => {
    const res = await agent.patch(`/usuarios/${userId}`).send({ estado: 'INACTIVO' })
    expect(res.status).toBe(200)
    expect(res.body.estado).toBe('INACTIVO')
  })

  test('200 — reactiva (INACTIVO → ACTIVO)', async () => {
    const res = await agent.patch(`/usuarios/${userId}`).send({ estado: 'ACTIVO' })
    expect(res.status).toBe(200)
    expect(res.body.estado).toBe('ACTIVO')
  })

  test('422 — estado inválido', async () => {
    const res = await agent.patch(`/usuarios/${userId}`).send({ estado: 'BLOQUEADO' })
    expect(res.status).toBe(422)
  })
})

describe('DELETE /usuarios/:id', () => {
  let userId

  beforeAll(async () => {
    const res = await agent.post('/usuarios').send(buildPasanteCreate({ matricula: 'DMAT01' }))
    userId = res.body.usuario.id
    tracker.track('usuarios', uuidToBuffer(userId))
  })

  test('401 — sin sesión', async () => {
    const res = await api.delete(`/usuarios/${NIL_UUID}`)
    expect(res.status).toBe(401)
  })

  test('404 — usuario inexistente', async () => {
    const res = await agent.delete(`/usuarios/${NIL_UUID}`)
    expect(res.status).toBe(404)
  })

  test('200 — elimina usuario existente', async () => {
    const res = await agent.delete(`/usuarios/${userId}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBeDefined()
    // El usuario ya está borrado; tracker.cleanup() para él será no-op (idempotente).
  })
})
