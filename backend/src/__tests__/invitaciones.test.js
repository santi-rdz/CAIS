import request from 'supertest'
import app from '#app'
import { prisma } from '#config/prisma.js'
import { loginAs } from './helpers/auth.js'
import { createInvitation } from './helpers/fixtures.js'

const api = request(app)
let agent

beforeAll(async () => {
  agent = await loginAs('coordAlt')
})

describe('POST /invitaciones — correo ya registrado', () => {
  let existingCorreo

  beforeAll(async () => {
    const row = await prisma.usuarios.findFirst({ select: { correo: true } })
    if (!row) throw new Error('Se requiere al menos un usuario en la DB para este test')
    existingCorreo = row.correo
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
    pending = await createInvitation()
  })

  afterAll(async () => {
    await pending.cleanup()
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
    inv = await createInvitation()
  })

  afterAll(async () => {
    await inv.cleanup()
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
    inv = await createInvitation()
  })

  afterEach(async () => {
    await inv.cleanup()
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
  })
})
