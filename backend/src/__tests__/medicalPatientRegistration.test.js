/**
 * @file Tests de integración para el registro atómico de paciente de medicina.
 *
 * POST /medicina/pacientes crea paciente + 1ª historia médica en una sola
 * transacción. Verifica el happy path, atomicidad ante input inválido, y guards
 * de sesión/área.
 */

import request from 'supertest'
import app from '#app'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createCleanupTracker } from './helpers/cleanup.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let nutricionAgent

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'MEDICINA', tracker })
  agent = auth.agent

  const nut = await authenticatedCoordinador({ area: 'NUTRICION', tracker })
  nutricionAgent = nut.agent
})

afterAll(async () => {
  await tracker.cleanup()
})

// ── Factories ──────────────────────────────────────────────────────────

const buildPatient = (overrides = {}) => ({
  nombre: 'Registro',
  apellidos: 'Médico',
  fecha_nacimiento: '2000-01-01',
  genero: 'Femenino',
  telefono: '5598765432',
  ...overrides,
})

const buildBody = (overrides = {}) => ({
  patient: buildPatient(),
  historia: {
    motivo_consulta: 'Dolor abdominal',
    tipo_sangre: 'O+',
    antecedentes_familiares: { padre: 'Diabetes', madre: 'HAS' },
  },
  ...overrides,
})

const trackResult = ({ patient, historia }) => {
  tracker.track('historias_medicas', uuidToBuffer(historia.id))
  tracker.track('pacientes', uuidToBuffer(patient.id))
}

// ── POST /medicina/pacientes ───────────────────────────────────────────

describe('POST /medicina/pacientes', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.post('/medicina/pacientes').send(buildBody())
    expect(res.status).toBe(401)
  })

  test('403 — usuario de otra área no puede registrar', async () => {
    const res = await nutricionAgent.post('/medicina/pacientes').send(buildBody())
    expect(res.status).toBe(403)
  })

  test('201 — crea paciente + historia médica atómicamente', async () => {
    const res = await agent.post('/medicina/pacientes').send(buildBody())
    expect(res.status).toBe(201)

    const { patient, historia } = res.body
    expect(patient.id).toBeDefined()
    expect(patient.nombre).toBe('Registro')
    expect(historia.id).toBeDefined()
    expect(historia.paciente_id).toBe(patient.id)
    expect(historia.antecedentes_familiares.padre).toBe('Diabetes')

    trackResult(res.body)

    const fromDb = await prisma.historias_medicas.findFirst({
      where: { paciente_id: uuidToBuffer(patient.id) },
    })
    expect(fromDb).not.toBeNull()
  })

  test('422 — input inválido no crea ningún paciente (atomicidad)', async () => {
    const nombre = `ZZ_${Date.now()}`
    const res = await agent.post('/medicina/pacientes').send(
      buildBody({
        patient: buildPatient({ nombre, telefono: '123' }), // teléfono inválido
      })
    )
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')

    const found = await prisma.pacientes.findFirst({ where: { nombre } })
    expect(found).toBeNull()
  })
})
