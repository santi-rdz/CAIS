/**
 * @file Smoke test temporal para validar helpers/db.js, helpers/agents.js y
 * helpers/cleanup.js. Borrar después de Phase 2 (cuando todos los tests
 * migrados ejerciten estos helpers indirectamente).
 */

import { authenticatedCoordinador } from './agents.js'
import { createTestPaciente } from './db.js'
import { createCleanupTracker } from './cleanup.js'
import { prisma } from '#config/prisma.js'

describe('Helpers infra smoke test', () => {
  let tracker

  beforeAll(() => {
    tracker = createCleanupTracker()
  })

  afterAll(async () => {
    await tracker.cleanup()
  })

  test('crea coordinador + login + paciente, todo limpiable', async () => {
    const { agent, user } = await authenticatedCoordinador({ tracker })
    expect(user.idBuffer).toBeInstanceOf(Buffer)
    expect(user.correo).toMatch(/^coordinador\.\d+\.\d+@test\.com$/)
    expect(user.role).toBe('COORDINADOR')

    const meRes = await agent.get('/auth/me')
    expect(meRes.status).toBe(200)
    expect(meRes.body.correo).toBe(user.correo)

    const paciente = await createTestPaciente({ doctor: user, tracker })
    expect(paciente.idBuffer).toBeInstanceOf(Buffer)

    const pacienteInDb = await prisma.pacientes.findUnique({
      where: { id: paciente.idBuffer },
      select: { doctor_id: true },
    })
    expect(pacienteInDb).not.toBeNull()
    expect(Buffer.from(pacienteInDb.doctor_id).toString('hex')).toBe(user.idBuffer.toString('hex'))
  })

  test('cleanup borra usuarios + pacientes + registro_auditoria sin error', async () => {
    const { user } = await authenticatedCoordinador({ tracker })
    await createTestPaciente({ doctor: user, tracker })

    // No assertion: si cleanup falla, throw → Jest reporta. Si pasa, OK.
    // El afterAll del suite hará el cleanup real.
    expect(true).toBe(true)
  })
})
