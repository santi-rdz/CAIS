/**
 * @file Tests de integración para el CRUD de TPAN de nutrición.
 *
 * Verifica listado, filtros por paciente, creación, actualización y
 * eliminación en /nutricion/tpan.
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
let historiaId

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'NUTRICION', tracker })
  agent = auth.agent

  const paciente = await createTestPaciente({ doctor: auth.user, tracker })
  pacienteId = paciente.id

  // Los TPAN cuelgan de una historia de nutrición (FK historia_paciente_id);
  // se limpian vía el pre-step de la historia tracked.
  const histRes = await agent
    .post('/nutricion/historias-nutricion')
    .send({ paciente_id: pacienteId, motivo_consulta: 'Setup TPAN' })
  historiaId = histRes.body.history?.id
  if (!historiaId) throw new Error(`No se pudo crear historia. status=${histRes.status}`)
  tracker.track('historias_pacientes_nutricion', uuidToBuffer(historiaId))
})

afterAll(() => tracker.cleanup())

const buildMinimal = (overrides = {}) => ({
  historia_paciente_id: historiaId,
  ...overrides,
})

const buildCompleto = (overrides = {}) => ({
  historia_paciente_id: historiaId,
  fecha_eval: '2024-05-10',
  eval_realizada: 'Evaluación nutricional completa',
  observacion: 'Paciente con déficit calórico moderado',
  estandares_com: 'DRI 2020',
  decision: 'Iniciar plan de alimentación hipercalórico',
  problema_iden: 'Ingesta oral inadecuada',
  causa_probl: 'Anorexia secundaria a tratamiento',
  evidencia_probl: 'Pérdida del 10% del peso en 3 meses',
  progreso: 2,
  ...overrides,
})

describe('GET /nutricion/tpan', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/tpan')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get(`/nutricion/tpan?historia_paciente_id=${historiaId}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('tpans')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.tpans)).toBe(true)
  })

  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get(`/nutricion/tpan?historia_paciente_id=${historiaId}&page=1&limit=2`)
    expect(res.status).toBe(200)
    expect(res.body.tpans.length).toBeLessThanOrEqual(2)
  })

  test('200 — filtra por historia_paciente_id', async () => {
    const created = await agent.post('/nutricion/tpan').send(buildMinimal())
    expect(created.status).toBe(201)
    tracker.track('tpan_nutricion', created.body.tpan.id)

    const res = await agent.get(`/nutricion/tpan?historia_paciente_id=${historiaId}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.tpans)).toBe(true)
    expect(res.body.tpans.length).toBeGreaterThan(0)
    for (const t of res.body.tpans) {
      expect(t.historia_paciente_id).toBe(historiaId)
    }
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent.get('/nutricion/tpan?historia_paciente_id=no-es-uuid')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza fields con valores no permitidos', async () => {
    const res = await agent.get(
      `/nutricion/tpan?historia_paciente_id=${historiaId}&fields=decision,__proto__`
    )
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })
})

describe('GET /nutricion/tpan/:id', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/tpan/0')
    expect(res.status).toBe(401)
  })

  test('404 — TPAN no existe', async () => {
    const res = await agent.get('/nutricion/tpan/999999')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

describe('POST /nutricion/tpan', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.post('/nutricion/tpan').send(buildMinimal())
    expect(res.status).toBe(401)
  })

  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/tpan').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/tpan')
      .send(buildMinimal({ historia_paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('422 — rechaza progreso fuera de rango TinyInt', async () => {
    const res = await agent.post('/nutricion/tpan').send(buildMinimal({ progreso: 200 }))
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('201 — crea TPAN mínimo', async () => {
    const res = await agent.post('/nutricion/tpan').send(buildMinimal())
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('tpan')
    const t = res.body.tpan
    expect(t.id).toBeDefined()
    expect(t.paciente_id).toBe(pacienteId)

    tracker.track('tpan_nutricion', t.id)
  })

  test('201 — crea TPAN con todos los campos', async () => {
    const res = await agent.post('/nutricion/tpan').send(buildCompleto())
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('tpan')
    const t = res.body.tpan
    expect(t.id).toBeDefined()
    expect(t.paciente_id).toBe(pacienteId)
    expect(t.eval_realizada).toBe('Evaluación nutricional completa')
    expect(t.observacion).toBe('Paciente con déficit calórico moderado')
    expect(t.estandares_com).toBe('DRI 2020')
    expect(t.decision).toBe('Iniciar plan de alimentación hipercalórico')
    expect(t.problema_iden).toBe('Ingesta oral inadecuada')
    expect(t.causa_probl).toBe('Anorexia secundaria a tratamiento')
    expect(t.evidencia_probl).toBe('Pérdida del 10% del peso en 3 meses')
    expect(t.progreso).toBe(2)

    tracker.track('tpan_nutricion', t.id)
  })
})

describe('PATCH /nutricion/tpan/:id', () => {
  let tpanId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/tpan').send(buildCompleto())
    tpanId = res.body.tpan?.id
    if (!tpanId) throw new Error(`No se pudo crear TPAN para PATCH. status=${res.status}`)
    tracker.track('tpan_nutricion', tpanId)
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.patch(`/nutricion/tpan/${tpanId}`).send({ observacion: 'Actualizado' })
    expect(res.status).toBe(401)
  })

  test('200 — actualiza observacion', async () => {
    const res = await agent
      .patch(`/nutricion/tpan/${tpanId}`)
      .send({ observacion: 'Observación actualizada' })
    expect(res.status).toBe(200)
    expect(res.body.observacion).toBe('Observación actualizada')
  })

  test('200 — actualiza decision', async () => {
    const res = await agent
      .patch(`/nutricion/tpan/${tpanId}`)
      .send({ decision: 'Mantener plan actual' })
    expect(res.status).toBe(200)
    expect(res.body.decision).toBe('Mantener plan actual')
  })

  test('200 — actualiza progreso', async () => {
    const res = await agent.patch(`/nutricion/tpan/${tpanId}`).send({ progreso: 5 })
    expect(res.status).toBe(200)
    expect(res.body.progreso).toBe(5)
  })

  test('200 — actualiza problema_iden y causa_probl', async () => {
    const res = await agent.patch(`/nutricion/tpan/${tpanId}`).send({
      problema_iden: 'Sobrepeso',
      causa_probl: 'Sedentarismo y dieta hipercalórica',
    })
    expect(res.status).toBe(200)
    expect(res.body.problema_iden).toBe('Sobrepeso')
    expect(res.body.causa_probl).toBe('Sedentarismo y dieta hipercalórica')
  })

  test('422 — rechaza progreso fuera de rango', async () => {
    const res = await agent.patch(`/nutricion/tpan/${tpanId}`).send({ progreso: 200 })
    expect(res.status).toBe(422)
  })

  test('422 — rechaza historia_paciente_id en PATCH', async () => {
    const res = await agent
      .patch(`/nutricion/tpan/${tpanId}`)
      .send({ historia_paciente_id: historiaId, observacion: 'X' })
    expect(res.status).toBe(422)
  })

  test('404 — TPAN no existe', async () => {
    const res = await agent.patch('/nutricion/tpan/999999').send({ observacion: 'X' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /nutricion/tpan/:id', () => {
  let tpanId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/tpan').send(buildCompleto())
    tpanId = res.body.tpan?.id
    if (!tpanId) throw new Error(`No se pudo crear TPAN para DELETE. status=${res.status}`)
    tracker.track('tpan_nutricion', tpanId)
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.delete(`/nutricion/tpan/${tpanId}`)
    expect(res.status).toBe(401)
  })

  test('404 — TPAN no existe', async () => {
    const res = await agent.delete('/nutricion/tpan/999999')
    expect(res.status).toBe(404)
  })

  test('200 — elimina el TPAN', async () => {
    const res = await agent.delete(`/nutricion/tpan/${tpanId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
    expect(res.body.paciente_id).toBe(pacienteId)
  })

  test('404 — confirma que ya no existe tras eliminar', async () => {
    const res = await agent.get(`/nutricion/tpan/${tpanId}`)
    expect(res.status).toBe(404)
  })
})
