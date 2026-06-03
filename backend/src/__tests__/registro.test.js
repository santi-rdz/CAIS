import request from 'supertest'
import app from '#app'
import { randomUUID } from 'node:crypto'
import {
  createInvitation,
  deleteInvitationsByEmails,
  deleteUsersByEmails,
} from './helpers/fixtures.js'
import { buildPasanteSignup, buildCoordSignup } from './helpers/factories.js'

const api = request(app)

describe('POST /usuarios/registro — auto-registro con token', () => {
  let pasanteInv
  let coordInv

  beforeAll(async () => {
    pasanteInv = await createInvitation({ role: 'PASANTE' })
    coordInv = await createInvitation({ role: 'COORDINADOR' })
  })

  afterAll(async () => {
    const correos = [pasanteInv.correo, coordInv.correo]
    await deleteInvitationsByEmails(correos)
    await deleteUsersByEmails(correos)
  })

  test('201 — registra pasante con token válido', async () => {
    const res = await api.post('/usuarios/registro').send(buildPasanteSignup(pasanteInv))

    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Registro completado exitosamente')
    expect(res.body.usuario.id).toBeDefined()
    expect(res.body.usuario.correo).toBe(pasanteInv.correo)
  })

  test('201 — registra coordinador con token válido', async () => {
    const res = await api.post('/usuarios/registro').send(buildCoordSignup(coordInv))

    expect(res.status).toBe(201)
    expect(res.body.usuario.id).toBeDefined()
  })

  test('404 — token ya usado', async () => {
    const res = await api.post('/usuarios/registro').send(buildPasanteSignup(pasanteInv))
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('NotFound')
  })

  test('404 — token inexistente', async () => {
    const res = await api
      .post('/usuarios/registro')
      .send(buildPasanteSignup({ token: randomUUID() }))
    expect(res.status).toBe(404)
  })

  test('422 — password débil rechazada', async () => {
    const weakInv = await createInvitation({ role: 'PASANTE' })
    try {
      const res = await api
        .post('/usuarios/registro')
        .send(buildPasanteSignup(weakInv, { password: 'simple', confirmPassword: 'simple' }))
      expect(res.status).toBe(422)
    } finally {
      await weakInv.cleanup()
    }
  })
})
