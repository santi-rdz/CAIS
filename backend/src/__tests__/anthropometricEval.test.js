import request from 'supertest'
import app from '#app'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createTestPaciente } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let historiaAdultoId
let historiaKidId

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'NUTRICION', tracker })
  agent = auth.agent

  // Paciente adulto (26 años en 2026)
  const pacienteAdulto = await createTestPaciente({
    doctor: auth.user,
    tracker,
    overrides: { fecha_nacimiento: new Date('2000-01-01') },
  })

  // Paciente menor de edad (11 años en 2026)
  const pacienteKid = await createTestPaciente({
    doctor: auth.user,
    tracker,
    overrides: { fecha_nacimiento: new Date('2015-01-01') },
  })

  // Las evaluaciones cuelgan de una historia de nutrición (FK
  // historia_paciente_id); se limpian vía el pre-step de la historia tracked.
  const histAdultoRes = await agent
    .post('/nutricion/historias-nutricion')
    .send({ paciente_id: pacienteAdulto.id, motivo_consulta: 'Setup eval antropométrica adulto' })
  historiaAdultoId = histAdultoRes.body.history?.id
  if (!historiaAdultoId) {
    throw new Error(`No se pudo crear historia adulto. status=${histAdultoRes.status}`)
  }
  tracker.track('historias_pacientes_nutricion', uuidToBuffer(historiaAdultoId))

  const histKidRes = await agent
    .post('/nutricion/historias-nutricion')
    .send({ paciente_id: pacienteKid.id, motivo_consulta: 'Setup eval antropométrica kid' })
  historiaKidId = histKidRes.body.history?.id
  if (!historiaKidId) {
    throw new Error(`No se pudo crear historia kid. status=${histKidRes.status}`)
  }
  tracker.track('historias_pacientes_nutricion', uuidToBuffer(historiaKidId))
})

afterAll(() => tracker.cleanup())

const buildMinimalAdulto = (overrides = {}) => ({
  historia_paciente_id: historiaAdultoId,
  adulto: {},
  ...overrides,
})

const buildCompletoAdulto = (overrides = {}) => ({
  historia_paciente_id: historiaAdultoId,
  fecha: '2024-05-10',
  peso_actual: 70,
  estatura: 170,
  imc: 24.2,
  pantorrilla: 35,
  cintura: 80,
  pb: 28,
  pct: 12,
  pcse: 15,
  adulto: {
    codo: 6.5,
    frisancho: 50,
    complexion: 'Mediana',
    pi_kg: 65,
    edema_liq: 0,
    peso_sin_edema: 70,
    peso_ajustado: 69,
    peso_ideal_por: 105,
    diagnostico_pi: 'Normal',
    diagnostico_imc: 'Normal',
    pcb: 10,
    pcsi: 12,
    riesgo_cv: false,
    cadera: 95,
    indice_cintura_cadera: 0.84,
    diagnostico_icc: 'Bajo',
    circuf_cuello: 35,
    riesgo_eo_inf: false,
  },
  ...overrides,
})

const buildCompletoKid = (overrides = {}) => ({
  historia_paciente_id: historiaKidId,
  fecha: '2024-05-10',
  peso_actual: 30,
  estatura: 130,
  imc: 17.8,
  pantorrilla: 22,
  cintura: 55,
  pb: 18,
  pct: 10,
  pcse: 8,
  kid: {
    percentiles_imc: 60,
    interpretacion_imc: 'Normal',
    percentiles_cintura: 55,
    percentiles_pb: 50,
    percentiles_pct: 45,
    percentiles_pcse: 40,
    peso_para_talla: 55,
    peso_ideal: 29,
    desviacion_estandar_peso: 0.2,
    interpretacion_nom_peso: 'Normal',
    talla_para_edad: 60,
    talla_ideal: 129,
    desviacion_estandar_talla: 0.1,
    interpretacion_nom_talla: 'Normal',
    peso_para_edad: 58,
    desviacion_estandar_peso_edad: 0.3,
    interpretacion_nom_peso_edad: 'Normal',
    diagnostico_general: 'Eutrófico',
    resistencia: 550,
    reactancia: 60,
    angulo_fase: 6.2,
    tan_angulo_fase: 0.11,
  },
  ...overrides,
})

describe('GET /nutricion/evaluacion-antropometrica', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/evaluacion-antropometrica')
    expect(res.status).toBe(401)
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get(
      `/nutricion/evaluacion-antropometrica?historia_paciente_id=${historiaAdultoId}`
    )
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('evals')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.evals)).toBe(true)
  })

  test('200 — filtra por historia_paciente_id', async () => {
    const created = await agent
      .post('/nutricion/evaluacion-antropometrica')
      .send(buildMinimalAdulto())
    expect(created.status).toBe(201)
    tracker.track('eval_antro_ad_nutricion', uuidToBuffer(created.body.evalAntro.id))

    const res = await agent.get(
      `/nutricion/evaluacion-antropometrica?historia_paciente_id=${historiaAdultoId}`
    )
    expect(res.status).toBe(200)
    expect(res.body.evals.length).toBeGreaterThan(0)
    for (const e of res.body.evals) {
      expect(e.historia_paciente_id).toBe(historiaAdultoId)
    }
  })

  test('422 — rechaza si falta historia_paciente_id', async () => {
    const res = await agent.get('/nutricion/evaluacion-antropometrica')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent.get(
      '/nutricion/evaluacion-antropometrica?historia_paciente_id=no-es-uuid'
    )
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })
})

describe('GET /nutricion/evaluacion-antropometrica/:id', () => {
  test('404 — evaluación no existe', async () => {
    const res = await agent.get(
      '/nutricion/evaluacion-antropometrica/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

describe('POST /nutricion/evaluacion-antropometrica', () => {
  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/evaluacion-antropometrica')
      .send(buildMinimalAdulto({ historia_paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('422 — rechaza si no envía ni kid ni adulto', async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send({
      historia_paciente_id: historiaAdultoId,
      peso_actual: 70,
    })
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza si envía kid y adulto a la vez', async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send(
      buildCompletoAdulto({
        kid: { diagnostico_general: 'Eutrófico' },
      })
    )
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('201 — crea evaluación de adulto sin datos completos', async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send(buildMinimalAdulto())
    expect(res.status).toBe(201)
    const e = res.body.evalAntro
    expect(e.id).toBeDefined()
    expect(e.historia_paciente_id).toBe(historiaAdultoId)
    expect(e.eval_antro_ad_adulto_nutricion).not.toBeNull()
    expect(e.eval_antro_ad_kid_nutricion).toBeNull()

    tracker.track('eval_antro_ad_nutricion', uuidToBuffer(e.id))
  })

  test('201 — crea evaluación de adulto con perfil completo', async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send(buildCompletoAdulto())
    expect(res.status).toBe(201)
    const e = res.body.evalAntro
    expect(e.historia_paciente_id).toBe(historiaAdultoId)
    expect(e.eval_antro_ad_adulto_nutricion).not.toBeNull()
    expect(e.eval_antro_ad_adulto_nutricion.complexion).toBe('Mediana')
    expect(e.eval_antro_ad_adulto_nutricion.indice_cintura_cadera).toBeCloseTo(0.84)
    expect(e.eval_antro_ad_kid_nutricion).toBeNull()

    tracker.track('eval_antro_ad_nutricion', uuidToBuffer(e.id))
  })

  test('201 — crea evaluación pediátrica (paciente menor de edad)', async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send(buildCompletoKid())
    expect(res.status).toBe(201)
    const e = res.body.evalAntro
    expect(e.historia_paciente_id).toBe(historiaKidId)
    expect(e.eval_antro_ad_kid_nutricion).not.toBeNull()
    expect(e.eval_antro_ad_kid_nutricion.diagnostico_general).toBe('Eutrófico')
    expect(e.eval_antro_ad_adulto_nutricion).toBeNull()

    tracker.track('eval_antro_ad_nutricion', uuidToBuffer(e.id))
  })

  test('422 — rechaza perfil "kid" para un paciente adulto', async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send(
      buildMinimalAdulto({
        adulto: undefined,
        kid: { diagnostico_general: 'Eutrófico' },
      })
    )
    expect(res.status).toBe(422)
  })

  test('422 — rechaza perfil "adulto" para un paciente menor de edad', async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send({
      historia_paciente_id: historiaKidId,
      adulto: { complexion: 'Mediana' },
    })
    expect(res.status).toBe(422)
  })
})

describe('PATCH /nutricion/evaluacion-antropometrica/:id', () => {
  let evalAdultoId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send(buildCompletoAdulto())
    evalAdultoId = res.body.evalAntro?.id
    if (!evalAdultoId) throw new Error(`No se pudo crear eval para PATCH. status=${res.status}`)
    tracker.track('eval_antro_ad_nutricion', uuidToBuffer(evalAdultoId))
  })

  test('200 — actualiza el perfil de adulto existente', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-antropometrica/${evalAdultoId}`)
      .send({ adulto: { complexion: 'Grande', cadera: 100 } })
    expect(res.status).toBe(200)
    expect(res.body.eval_antro_ad_adulto_nutricion.complexion).toBe('Grande')
    expect(res.body.eval_antro_ad_adulto_nutricion.cadera).toBe(100)
  })

  test('200 — actualiza campos base sin tocar el perfil', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-antropometrica/${evalAdultoId}`)
      .send({ peso_actual: 72 })
    expect(res.status).toBe(200)
    expect(res.body.peso_actual).toBe(72)
  })

  // El modelo solo actualiza el perfil que ya existe (kid XOR adulto); no
  // hace upsert cruzado. Enviar `kid` a una evaluación de adulto no debe
  // crear un perfil kid nuevo.
  test('200 — ignora un perfil "kid" en una evaluación de adulto', async () => {
    const res = await agent
      .patch(`/nutricion/evaluacion-antropometrica/${evalAdultoId}`)
      .send({ kid: { diagnostico_general: 'Eutrófico' } })
    expect(res.status).toBe(200)
    expect(res.body.eval_antro_ad_kid_nutricion).toBeNull()
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent
      .patch('/nutricion/evaluacion-antropometrica/00000000-0000-0000-0000-000000000000')
      .send({ adulto: { complexion: 'Mediana' } })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /nutricion/evaluacion-antropometrica/:id', () => {
  let evalAdultoId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/evaluacion-antropometrica').send(buildCompletoAdulto())
    evalAdultoId = res.body.evalAntro?.id
    if (!evalAdultoId) throw new Error(`No se pudo crear eval para DELETE. status=${res.status}`)
    tracker.track('eval_antro_ad_nutricion', uuidToBuffer(evalAdultoId))
  })

  test('404 — evaluación no existe', async () => {
    const res = await agent.delete(
      '/nutricion/evaluacion-antropometrica/00000000-0000-0000-0000-000000000000'
    )
    expect(res.status).toBe(404)
  })

  test('200 — elimina la evaluación y su perfil en cascada', async () => {
    const evalBuffer = uuidToBuffer(evalAdultoId)
    const res = await agent.delete(`/nutricion/evaluacion-antropometrica/${evalAdultoId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()

    const check = await agent.get(`/nutricion/evaluacion-antropometrica/${evalAdultoId}`)
    expect(check.status).toBe(404)

    // El cascade de la DB debe haber borrado el perfil de adulto, no solo el padre.
    const adulto = await prisma.eval_antro_ad_adulto_nutricion.findMany({
      where: { eval_antro_id: evalBuffer },
    })
    expect(adulto).toHaveLength(0)
  })
})
