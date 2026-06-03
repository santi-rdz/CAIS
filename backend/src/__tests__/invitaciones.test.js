import request from 'supertest'
import app from '#app'
import { prisma } from '#config/prisma.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createTestCoordinador, createTestInvitation } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let inviter // el coordinador del agent (firma las invitaciones)

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ tracker })
  agent = auth.agent
  inviter = auth.user
})

afterAll(() => tracker.cleanup())

describe('POST /invitaciones — correo ya registrado', () => {
  let existingCorreo

  beforeAll(async () => {
    // En vez de fetchear el primer user del seed, creamos uno propio.
    const existing = await createTestCoordinador({ tracker })
    existingCorreo = existing.correo
  })

  test('409 — rechaza correo ya registrado en usuarios', async () => {
    const res = await agent.post('/invitaciones').send([{ email: existingCorreo, role: 'pasante' }])

    expect(res.status).toBe(409)
    expect(res.body.error).toBe('Conflict')
    expect(Array.isArray(res.body.emails)).toBe(true)
    expect(res.body.emails).toContain(existingCorreo)
  })
})

describe('POST /invitaciones — invitación pendiente', () => {
  let pending

  beforeAll(async () => {
    pending = await createTestInvitation({ invitedBy: inviter, tracker })
  })

  test('409 — rechaza correo con invitación pendiente', async () => {
    const res = await agent.post('/invitaciones').send([{ email: pending.correo, role: 'pasante' }])

    expect(res.status).toBe(409)
    expect(res.body.error).toBe('Conflict')
    expect(Array.isArray(res.body.emails)).toBe(true)
    expect(res.body.emails).toContain(pending.correo)
  })
})

describe('POST /invitaciones/reenviar', () => {
  let inv

  beforeAll(async () => {
    inv = await createTestInvitation({ invitedBy: inviter, tracker })
  })

  test('401 — sin sesión', async () => {
    const res = await api.post('/invitaciones/reenviar').send({ correo: inv.correo })
    expect(res.status).toBe(401)
  })

  test('422 — falta correo en el body', async () => {
    const res = await agent.post('/invitaciones/reenviar').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('404 — correo sin invitación pendiente', async () => {
    const res = await agent.post('/invitaciones/reenviar').send({ correo: 'noexiste@test.com' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('NotFound')
  })

  test('200 — reenvía invitación pendiente', async () => {
    const res = await agent.post('/invitaciones/reenviar').send({ correo: inv.correo })
    expect(res.status).toBe(200)
    expect(res.body.message).toBeDefined()
  })

  test('el token se renueva tras el reenvío', async () => {
    const before = await prisma.invitaciones_registro.findFirst({
      where: { correo: inv.correo },
      select: { token: true },
    })

    await agent.post('/invitaciones/reenviar').send({ correo: inv.correo })

    const after = await prisma.invitaciones_registro.findFirst({
      where: { correo: inv.correo },
      select: { token: true },
    })

    expect(after.token).not.toEqual(before.token)
  })
})

describe('DELETE /invitaciones', () => {
  let inv

  beforeEach(async () => {
    inv = await createTestInvitation({ invitedBy: inviter, tracker })
  })

  test('401 — sin sesión', async () => {
    const res = await api.delete('/invitaciones').send({ correo: inv.correo })
    expect(res.status).toBe(401)
  })

  test('422 — falta correo en el body', async () => {
    const res = await agent.delete('/invitaciones').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('404 — correo sin invitación pendiente', async () => {
    const res = await agent.delete('/invitaciones').send({ correo: 'noexiste@test.com' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('NotFound')
  })

  test('200 — elimina invitación pendiente', async () => {
    const res = await agent.delete('/invitaciones').send({ correo: inv.correo })
    expect(res.status).toBe(200)
    expect(res.body.message).toBeDefined()

    const found = await prisma.invitaciones_registro.findFirst({
      where: { correo: inv.correo },
    })
    expect(found).toBeNull()
    // Trackeada en el helper; tracker.cleanup() en afterAll será idempotente.
  })
})
