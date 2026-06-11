/**
 * @file Tests de integración para el registro atómico de paciente de nutrición.
 *
 * POST /nutricion/pacientes crea paciente + 1ª historia nutricional en una sola
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
let medicinaAgent

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'NUTRICION', tracker })
  agent = auth.agent

  const med = await authenticatedCoordinador({ area: 'MEDICINA', tracker })
  medicinaAgent = med.agent
})

afterAll(async () => {
  await tracker.cleanup()
})

// ── Factories ──────────────────────────────────────────────────────────

const buildPatient = (overrides = {}) => ({
  nombre: 'Registro',
  apellidos: 'Atómico',
  fecha_nacimiento: '2000-01-01',
  genero: 'Masculino',
  telefono: '5512345678',
  ...overrides,
})

const buildBody = (overrides = {}) => ({
  patient: buildPatient(),
  historia: {
    motivo_consulta: 'Control de peso',
    historias_medicas_nutricion: [{ enfermedad: 'DM2', evol: 5, farmacos: 'Metformina' }],
    adicciones: { adicto_tabaco: 'si', tabaco_frecuencia: 'Diario', num_cigarros_d: 10 },
  },
  ...overrides,
})

const trackResult = ({ patient, historia }) => {
  tracker.track('historias_pacientes_nutricion', uuidToBuffer(historia.id))
  tracker.track('pacientes', uuidToBuffer(patient.id))
  if (historia.adicciones?.id) tracker.track('adicciones', historia.adicciones.id)
}

// ── POST /nutricion/pacientes ──────────────────────────────────────────

describe('POST /nutricion/pacientes', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.post('/nutricion/pacientes').send(buildBody())
    expect(res.status).toBe(401)
  })

  test('403 — usuario de otra área no puede registrar', async () => {
    const res = await medicinaAgent.post('/nutricion/pacientes').send(buildBody())
    expect(res.status).toBe(403)
  })

  test('201 — crea paciente + historia nutricional atómicamente', async () => {
    const res = await agent.post('/nutricion/pacientes').send(buildBody())
    expect(res.status).toBe(201)

    const { patient, historia } = res.body
    expect(patient.id).toBeDefined()
    expect(patient.nombre).toBe('Registro')
    expect(historia.id).toBeDefined()
    expect(historia.paciente_id).toBe(patient.id)
    expect(historia.historias_medicas_nutricion).toHaveLength(1)
    expect(historia.adicciones.adicto_tabaco).toBe('si')

    trackResult(res.body)

    // La historia quedó realmente persistida y ligada al paciente.
    const fromDb = await prisma.historias_pacientes_nutricion.findFirst({
      where: { paciente_id: uuidToBuffer(patient.id) },
    })
    expect(fromDb).not.toBeNull()
  })

  test('422 — input inválido no crea ningún paciente (atomicidad)', async () => {
    const nombre = `ZZ_${Date.now()}`
    const res = await agent.post('/nutricion/pacientes').send(
      buildBody({
        patient: buildPatient({ nombre, genero: '' }), // género vacío → inválido
      })
    )
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')

    const found = await prisma.pacientes.findFirst({ where: { nombre } })
    expect(found).toBeNull()
  })
})
