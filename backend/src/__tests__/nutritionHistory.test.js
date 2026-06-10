/**
 * @file Tests de integración para el CRUD de historias de pacientes de nutrición.
 *
 * Verifica listado, filtros por paciente, creación (con y sin relaciones 1:N),
 * actualización y eliminación en /nutricion/historias-nutricion.
 */

import request from 'supertest'
import app from '#app'
import { uuidToBuffer } from '#lib/uuid.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createTestPaciente } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let pacienteId

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'NUTRICION', tracker })
  agent = auth.agent

  const paciente = await createTestPaciente({ doctor: auth.user, tracker })
  pacienteId = paciente.id
})

afterAll(() => tracker.cleanup())

// ── Factories locales ─────────────────────────────────────────────

const buildMinimal = (overrides = {}) => ({
  paciente_id: pacienteId,
  motivo_consulta: 'Consulta de prueba',
  ...overrides,
})

const buildCompleto = (overrides = {}) => ({
  paciente_id: pacienteId,
  motivo_consulta: 'Consulta completa de prueba',
  fecha_ingreso: '2024-01-15',
  historias_medicas_nutricion: [
    { enfermedad: 'Diabetes tipo 2', evol: 5, farmacos: 'Metformina', dosis: '500mg' },
    { enfermedad: 'Hipertensión', evol: 3, farmacos: 'Losartán', dosis: '50mg' },
  ],
  eval_act_fisica_nutricion: [
    {
      fecha: '2024-01-15',
      tipo: 'Aeróbico',
      frecuencia: 'Semanal',
      duracion: 30,
      intensidad: 3,
      tiempo_de_practica: '6 meses',
      pensamientos_con_realizar_AF: 'Positivos',
    },
  ],
  eval_cal_sueno: [{ fecha: '2024-01-15', horas_sueno: 7, insomnio: 1, medicacion: 0 }],
  tratamiento_alt_nutricion: [
    { producto: 'Suplemento', cual_producto: 'Vitamina C', mejora: 'Sí', dosis: '500mg' },
  ],
  ...overrides,
})

// ── GET /nutricion/historias-nutricion ─────────────────────────────

describe('GET /nutricion/historias-nutricion', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/historias-nutricion')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/nutricion/historias-nutricion')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('histories')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.histories)).toBe(true)
  })

  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/nutricion/historias-nutricion?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(res.body.histories.length).toBeLessThanOrEqual(2)
  })

  test('200 — filtra por paciente_id', async () => {
    const created = await agent
      .post('/nutricion/historias-nutricion')
      .send(buildMinimal({ motivo_consulta: 'Para validar filtro por paciente' }))
    expect(created.status).toBe(201)
    tracker.track('historias_pacientes_nutricion', uuidToBuffer(created.body.history.id))

    const res = await agent.get(`/nutricion/historias-nutricion?paciente_id=${pacienteId}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.histories)).toBe(true)
    expect(res.body.histories.length).toBeGreaterThan(0)
    for (const h of res.body.histories) {
      expect(h.paciente_id).toBe(pacienteId)
    }
  })
})

// ── GET /nutricion/historias-nutricion/:id ─────────────────────────

describe('GET /nutricion/historias-nutricion/:id', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/historias-nutricion/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(401)
  })

  test('404 — historia no existe', async () => {
    const res = await agent.get(
      '/nutricion/historias-nutricion/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

// ── POST /nutricion/historias-nutricion ────────────────────────────

describe('POST /nutricion/historias-nutricion', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.post('/nutricion/historias-nutricion').send(buildMinimal())
    expect(res.status).toBe(401)
  })

  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/historias-nutricion').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/historias-nutricion')
      .send(buildMinimal({ paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('201 — crea historia sin relaciones', async () => {
    const res = await agent.post('/nutricion/historias-nutricion').send(buildMinimal())
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('history')
    const h = res.body.history
    expect(h.id).toBeDefined()
    expect(h.paciente_id).toBe(pacienteId)
    expect(h.historias_medicas_nutricion).toEqual([])
    expect(h.eval_act_fisica_nutricion).toEqual([])
    expect(h.eval_cal_sueno).toEqual([])
    expect(h.tratamiento_alt_nutricion).toEqual([])

    tracker.track('historias_pacientes_nutricion', uuidToBuffer(h.id))
  })

  test('201 — crea historia con todas las relaciones', async () => {
    const res = await agent.post('/nutricion/historias-nutricion').send(buildCompleto())
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('history')
    const h = res.body.history
    expect(h.id).toBeDefined()
    expect(h.paciente_id).toBe(pacienteId)

    expect(h.historias_medicas_nutricion).toHaveLength(2)
    expect(h.historias_medicas_nutricion[0].enfermedad).toBe('Diabetes tipo 2')
    expect(h.historias_medicas_nutricion[1].enfermedad).toBe('Hipertensión')

    expect(h.eval_act_fisica_nutricion).toHaveLength(1)
    expect(h.eval_act_fisica_nutricion[0].tipo).toBe('Aeróbico')

    expect(h.eval_cal_sueno).toHaveLength(1)
    expect(h.eval_cal_sueno[0].horas_sueno).toBe(7)

    expect(h.tratamiento_alt_nutricion).toHaveLength(1)
    expect(h.tratamiento_alt_nutricion[0].producto).toBe('Suplemento')

    tracker.track('historias_pacientes_nutricion', uuidToBuffer(h.id))
  })
})

// ── PATCH /nutricion/historias-nutricion/:id ───────────────────────

describe('PATCH /nutricion/historias-nutricion/:id', () => {
  let historiaId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/historias-nutricion').send(buildCompleto())
    historiaId = res.body.history?.id
    if (!historiaId) throw new Error(`No se pudo crear historia para PATCH. status=${res.status}`)
    tracker.track('historias_pacientes_nutricion', uuidToBuffer(historiaId))
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api
      .patch(`/nutricion/historias-nutricion/${historiaId}`)
      .send({ motivo_consulta: 'Actualizado' })
    expect(res.status).toBe(401)
  })

  test('200 — actualiza campo directo motivo_consulta', async () => {
    const res = await agent
      .patch(`/nutricion/historias-nutricion/${historiaId}`)
      .send({ motivo_consulta: 'Motivo actualizado' })
    expect(res.status).toBe(200)
    expect(res.body.motivo_consulta).toBe('Motivo actualizado')
  })

  test('200 — reemplaza historias_medicas_nutricion', async () => {
    const res = await agent.patch(`/nutricion/historias-nutricion/${historiaId}`).send({
      historias_medicas_nutricion: [
        { enfermedad: 'Obesidad', evol: 2, farmacos: 'Ninguno', dosis: null },
      ],
    })
    expect(res.status).toBe(200)
    expect(res.body.historias_medicas_nutricion).toHaveLength(1)
    expect(res.body.historias_medicas_nutricion[0].enfermedad).toBe('Obesidad')
  })

  test('200 — reemplaza eval_act_fisica_nutricion', async () => {
    const res = await agent.patch(`/nutricion/historias-nutricion/${historiaId}`).send({
      eval_act_fisica_nutricion: [
        { tipo: 'Resistencia', frecuencia: 'Diaria', duracion: 45, intensidad: 5 },
        { tipo: 'Flexibilidad', frecuencia: 'Semanal', duracion: 20, intensidad: 2 },
      ],
    })
    expect(res.status).toBe(200)
    expect(res.body.eval_act_fisica_nutricion).toHaveLength(2)
    expect(res.body.eval_act_fisica_nutricion[0].tipo).toBe('Resistencia')
  })

  test('200 — reemplaza eval_cal_sueno', async () => {
    const res = await agent
      .patch(`/nutricion/historias-nutricion/${historiaId}`)
      .send({ eval_cal_sueno: [{ horas_sueno: 8, insomnio: 0, medicacion: 0 }] })
    expect(res.status).toBe(200)
    expect(res.body.eval_cal_sueno).toHaveLength(1)
    expect(res.body.eval_cal_sueno[0].horas_sueno).toBe(8)
  })

  test('200 — reemplaza tratamiento_alt_nutricion', async () => {
    const res = await agent.patch(`/nutricion/historias-nutricion/${historiaId}`).send({
      tratamiento_alt_nutricion: [
        { producto: 'Té', cual_producto: 'Té verde', mejora: 'No', dosis: '1 taza' },
      ],
    })
    expect(res.status).toBe(200)
    expect(res.body.tratamiento_alt_nutricion).toHaveLength(1)
    expect(res.body.tratamiento_alt_nutricion[0].cual_producto).toBe('Té verde')
  })

  test('404 — historia no existe', async () => {
    const res = await agent
      .patch('/nutricion/historias-nutricion/00000000-0000-0000-0000-000000000000')
      .send({ motivo_consulta: 'X' })
    expect(res.status).toBe(404)
  })
})

// ── DELETE /nutricion/historias-nutricion/:id ──────────────────────

describe('DELETE /nutricion/historias-nutricion/:id', () => {
  let historiaId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/historias-nutricion').send(buildCompleto())
    historiaId = res.body.history?.id
    if (!historiaId) throw new Error(`No se pudo crear historia para DELETE. status=${res.status}`)
    tracker.track('historias_pacientes_nutricion', uuidToBuffer(historiaId))
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.delete(`/nutricion/historias-nutricion/${historiaId}`)
    expect(res.status).toBe(401)
  })

  test('404 — historia no existe', async () => {
    const res = await agent.delete(
      '/nutricion/historias-nutricion/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
  })

  test('200 — elimina la historia de nutrición', async () => {
    const res = await agent.delete(`/nutricion/historias-nutricion/${historiaId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
  })

  test('404 — confirma que ya no existe tras eliminar', async () => {
    const res = await agent.get(`/nutricion/historias-nutricion/${historiaId}`)
    expect(res.status).toBe(404)
  })
})
