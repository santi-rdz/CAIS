/**
 * @file Tests de integración para el CRUD de examen físico de orientación nutricional.
 *
 * Verifica listado, filtros por paciente, creación (con y sin síntomas gastrointestinales),
 * actualización y eliminación en /nutricion/examinacion-fisica.
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
  eval_perdida_peso: {
    peso_habitual: 70,
    peso_perdido: 5,
    porcentaje_peso_perdido: 7.14,
  },
  signos_vitales: {
    tas: 120,
    tad: 80,
    temperatura: 36.5,
    dificultad_respiratoria: false,
  },
  semiologia: {
    pcb: 'Normal',
    pct: 'Normal',
    diag_reservagrasa: 'Adecuada',
    diag_reserva_muscular: 'Adecuada',
    edema: 'Ausente',
  },
  ...overrides,
})

const buildCompleto = (overrides = {}) => ({
  ...buildMinimal(),
  fecha: '2024-03-10',
  eval_perdida_peso: {
    peso_habitual: 85,
    peso_perdido: 10,
    porcentaje_peso_perdido: 11.76,
  },
  signos_vitales: {
    tas: 130,
    tad: 85,
    temperatura: 37.0,
    dificultad_respiratoria: false,
  },
  semiologia: {
    pcb: 'Reducida',
    pct: 'Reducida',
    fondo_ojo: 'Normal',
    diag_reservagrasa: 'Reducida',
    sienes: 'Hundidas',
    clavicula: 'Prominente',
    hombros: 'Cuadrados',
    omoplato: 'Prominente',
    interoseos_mano: 'Reducidos',
    costillas: 'Visibles',
    espalda_alta: 'Normal',
    cuadriceps: 'Reducido',
    pantorrilla: 'Reducida',
    diag_reserva_muscular: 'Reducida',
    edema: 'Presente',
    descripcion: 'Paciente con signos de desnutrición moderada',
    descripcion_sist_genito_urinario: 'Sin alteraciones',
  },
  eval_sintomas_gastroin: [
    { presenta_sgi: true, presencia: 'Náuseas frecuentes' },
    { presenta_sgi: true, presencia: 'Distensión abdominal' },
  ],
  ...overrides,
})

// ── GET /nutricion/examinacion-fisica ─────────────────────────────

describe('GET /nutricion/examinacion-fisica', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/examinacion-fisica')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/nutricion/examinacion-fisica')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('exams')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.exams)).toBe(true)
  })

  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/nutricion/examinacion-fisica?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(res.body.exams.length).toBeLessThanOrEqual(2)
  })

  test('200 — filtra por paciente_id', async () => {
    const created = await agent.post('/nutricion/examinacion-fisica').send(buildMinimal())
    expect(created.status).toBe(201)
    tracker.track('exam_fis_orien_nutricion', uuidToBuffer(created.body.exam.id))

    const res = await agent.get(`/nutricion/examinacion-fisica?paciente_id=${pacienteId}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.exams)).toBe(true)
    expect(res.body.exams.length).toBeGreaterThan(0)
    for (const e of res.body.exams) {
      expect(e.paciente_id).toBe(pacienteId)
    }
  })
})

// ── GET /nutricion/examinacion-fisica/:id ────────────────────────

describe('GET /nutricion/examinacion-fisica/:id', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/examinacion-fisica/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(401)
  })

  test('404 — examen no existe', async () => {
    const res = await agent.get(
      '/nutricion/examinacion-fisica/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

// ── POST /nutricion/examinacion-fisica ────────────────────────────

describe('POST /nutricion/examinacion-fisica', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.post('/nutricion/examinacion-fisica').send(buildMinimal())
    expect(res.status).toBe(401)
  })

  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/examinacion-fisica').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/examinacion-fisica')
      .send(buildMinimal({ paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('422 — rechaza body sin eval_perdida_peso', async () => {
    const { eval_perdida_peso, ...sinPerdidaPeso } = buildMinimal()
    const res = await agent.post('/nutricion/examinacion-fisica').send(sinPerdidaPeso)
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza body sin signos_vitales', async () => {
    const { signos_vitales, ...sinSignos } = buildMinimal()
    const res = await agent.post('/nutricion/examinacion-fisica').send(sinSignos)
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza body sin semiologia', async () => {
    const { semiologia, ...sinSemiologia } = buildMinimal()
    const res = await agent.post('/nutricion/examinacion-fisica').send(sinSemiologia)
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('201 — crea examen sin síntomas gastrointestinales', async () => {
    const res = await agent.post('/nutricion/examinacion-fisica').send(buildMinimal())
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('exam')
    const e = res.body.exam
    expect(e.id).toBeDefined()
    expect(e.paciente_id).toBe(pacienteId)
    expect(e.eval_perdida_peso_nutricion).toBeDefined()
    expect(e.eval_perdida_peso_nutricion.peso_habitual).toBe(70)
    expect(e.signos_vitales_nutricion).toBeDefined()
    expect(e.signos_vitales_nutricion.tas).toBe(120)
    expect(e.eval_semiologia_nutricional).toBeDefined()
    expect(e.eval_semiologia_nutricional.edema).toBe('Ausente')
    expect(e.eval_sintomas_gastroin_nutricion).toEqual([])

    tracker.track('exam_fis_orien_nutricion', uuidToBuffer(e.id))
  })

  test('201 — crea examen con todas las relaciones', async () => {
    const res = await agent.post('/nutricion/examinacion-fisica').send(buildCompleto())
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('exam')
    const e = res.body.exam
    expect(e.id).toBeDefined()
    expect(e.paciente_id).toBe(pacienteId)

    expect(e.eval_perdida_peso_nutricion.peso_habitual).toBe(85)
    expect(e.eval_perdida_peso_nutricion.porcentaje_peso_perdido).toBe(11.76)

    expect(e.signos_vitales_nutricion.tas).toBe(130)
    expect(e.signos_vitales_nutricion.dificultad_respiratoria).toBe(false)

    expect(e.eval_semiologia_nutricional.diag_reservagrasa).toBe('Reducida')
    expect(e.eval_semiologia_nutricional.edema).toBe('Presente')

    expect(e.eval_sintomas_gastroin_nutricion).toHaveLength(2)
    expect(e.eval_sintomas_gastroin_nutricion[0].presencia).toBe('Náuseas frecuentes')
    expect(e.eval_sintomas_gastroin_nutricion[1].presencia).toBe('Distensión abdominal')

    tracker.track('exam_fis_orien_nutricion', uuidToBuffer(e.id))
  })
})

// ── PATCH /nutricion/examinacion-fisica/:id ──────────────────────

describe('PATCH /nutricion/examinacion-fisica/:id', () => {
  let examId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/examinacion-fisica').send(buildCompleto())
    examId = res.body.exam?.id
    if (!examId) throw new Error(`No se pudo crear examen para PATCH. status=${res.status}`)
    tracker.track('exam_fis_orien_nutricion', uuidToBuffer(examId))
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api
      .patch(`/nutricion/examinacion-fisica/${examId}`)
      .send({ fecha: '2024-04-01' })
    expect(res.status).toBe(401)
  })

  test('200 — actualiza campo directo fecha', async () => {
    const res = await agent
      .patch(`/nutricion/examinacion-fisica/${examId}`)
      .send({ fecha: '2024-04-01' })
    expect(res.status).toBe(200)
    expect(res.body.fecha).toBe('2024-04-01T00:00:00.000Z')
  })

  test('200 — actualiza eval_perdida_peso', async () => {
    const res = await agent.patch(`/nutricion/examinacion-fisica/${examId}`).send({
      eval_perdida_peso: { peso_habitual: 90, peso_perdido: 8, porcentaje_peso_perdido: 8.88 },
    })
    expect(res.status).toBe(200)
    expect(res.body.eval_perdida_peso_nutricion.peso_habitual).toBe(90)
    expect(res.body.eval_perdida_peso_nutricion.peso_perdido).toBe(8)
  })

  test('200 — actualiza signos_vitales', async () => {
    const res = await agent.patch(`/nutricion/examinacion-fisica/${examId}`).send({
      signos_vitales: { tas: 115, tad: 75, temperatura: 36.8, dificultad_respiratoria: true },
    })
    expect(res.status).toBe(200)
    expect(res.body.signos_vitales_nutricion.tas).toBe(115)
    expect(res.body.signos_vitales_nutricion.dificultad_respiratoria).toBe(true)
  })

  test('200 — actualiza semiologia', async () => {
    const res = await agent.patch(`/nutricion/examinacion-fisica/${examId}`).send({
      semiologia: { edema: 'Ausente', diag_reserva_muscular: 'Adecuada' },
    })
    expect(res.status).toBe(200)
    expect(res.body.eval_semiologia_nutricional.edema).toBe('Ausente')
    expect(res.body.eval_semiologia_nutricional.diag_reserva_muscular).toBe('Adecuada')
  })

  test('200 — reemplaza eval_sintomas_gastroin', async () => {
    const res = await agent.patch(`/nutricion/examinacion-fisica/${examId}`).send({
      eval_sintomas_gastroin: [{ presenta_sgi: false, presencia: 'Sin síntomas' }],
    })
    expect(res.status).toBe(200)
    expect(res.body.eval_sintomas_gastroin_nutricion).toHaveLength(1)
    expect(res.body.eval_sintomas_gastroin_nutricion[0].presencia).toBe('Sin síntomas')
  })

  test('200 — vaciar eval_sintomas_gastroin con arreglo vacío', async () => {
    const res = await agent
      .patch(`/nutricion/examinacion-fisica/${examId}`)
      .send({ eval_sintomas_gastroin: [] })
    expect(res.status).toBe(200)
    expect(res.body.eval_sintomas_gastroin_nutricion).toEqual([])
  })

  test('404 — examen no existe', async () => {
    const res = await agent
      .patch('/nutricion/examinacion-fisica/00000000-0000-0000-0000-000000000000')
      .send({ fecha: '2024-04-01' })
    expect(res.status).toBe(404)
  })
})

// ── DELETE /nutricion/examinacion-fisica/:id ─────────────────────

describe('DELETE /nutricion/examinacion-fisica/:id', () => {
  let examId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/examinacion-fisica').send(buildCompleto())
    examId = res.body.exam?.id
    if (!examId) throw new Error(`No se pudo crear examen para DELETE. status=${res.status}`)
    tracker.track('exam_fis_orien_nutricion', uuidToBuffer(examId))
  })

  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.delete(`/nutricion/examinacion-fisica/${examId}`)
    expect(res.status).toBe(401)
  })

  test('404 — examen no existe', async () => {
    const res = await agent.delete(
      '/nutricion/examinacion-fisica/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
  })

  test('200 — elimina el examen y sus registros relacionados', async () => {
    const res = await agent.delete(`/nutricion/examinacion-fisica/${examId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
    expect(res.body.paciente_id).toBe(pacienteId)
  })

  test('404 — confirma que ya no existe tras eliminar', async () => {
    const res = await agent.get(`/nutricion/examinacion-fisica/${examId}`)
    expect(res.status).toBe(404)
  })
})
