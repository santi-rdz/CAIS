import request from 'supertest'
import app from '#app'
import { randomUUID } from 'node:crypto'
import { uuidToBuffer } from '#lib/uuid.js'
import { createTestCoordinador, createTestInvitation } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'
import { buildPasanteSignup, buildCoordSignup } from './helpers/factories.js'

const api = request(app)
const tracker = createCleanupTracker()
afterAll(() => tracker.cleanup())

describe('POST /usuarios/registro — auto-registro con token', () => {
  let inviter
  let pasanteInv
  let coordInv

  beforeAll(async () => {
    inviter = await createTestCoordinador({ tracker })
    pasanteInv = await createTestInvitation({ invitedBy: inviter, role: 'PASANTE', tracker })
    coordInv = await createTestInvitation({ invitedBy: inviter, role: 'COORDINADOR', tracker })
  })

  test('201 — registra pasante con token válido', async () => {
    const res = await api.post('/usuarios/registro').send(buildPasanteSignup(pasanteInv))

    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Registro completado exitosamente')
    expect(res.body.usuario.id).toBeDefined()
    expect(res.body.usuario.correo).toBe(pasanteInv.correo)

    // El endpoint creó un usuario nuevo — trackeamos para que cleanup lo borre.
    tracker.track('usuarios', uuidToBuffer(res.body.usuario.id))
  })

  test('201 — registra coordinador con token válido', async () => {
    const res = await api.post('/usuarios/registro').send(buildCoordSignup(coordInv))

    expect(res.status).toBe(201)
    expect(res.body.usuario.id).toBeDefined()

    tracker.track('usuarios', uuidToBuffer(res.body.usuario.id))
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
    const weakInv = await createTestInvitation({ invitedBy: inviter, role: 'PASANTE', tracker })
    const res = await api
      .post('/usuarios/registro')
      .send(buildPasanteSignup(weakInv, { password: 'simple', confirmPassword: 'simple' }))
    expect(res.status).toBe(422)
    // No se creó usuario (422), no hay que trackear nada extra.
  })
})
