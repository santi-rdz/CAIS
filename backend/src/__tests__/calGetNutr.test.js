/**
 * @file Tests de integración para el cálculo de GET nutricional.
 *
 * Además de los campos crudos, cada registro devuelve `total_kcal`,
 * `total_proteinas`, `total_grasas` y `total_carbohidratos`, calculados por
 * la Prisma Client Extension (ver lib/calGetNutrExtension.js) a partir de
 * los valores reales de EQUIVALENTES_NUTRICIONALES — se verifican con
 * aritmética exacta, no solo con "no es null".
 */

import request from 'supertest'
import app from '#app'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { NIL_UUID } from './helpers/constants.js'
import { authenticatedCoordinador } from './helpers/agents.js'
import { createTestPaciente } from './helpers/db.js'
import { createCleanupTracker } from './helpers/cleanup.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let historiaId

beforeAll(async () => {
  const auth = await authenticatedCoordinador({ area: 'NUTRICION', tracker })
  agent = auth.agent

  const paciente = await createTestPaciente({ doctor: auth.user, tracker })

  const histRes = await agent
    .post('/nutricion/historias-nutricion')
    .send({ paciente_id: paciente.id, motivo_consulta: 'Setup cal GET nutricional' })
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
  verdura: 4,
  fruta: 3,
  cereal_sin_grasa: 6,
  cereal_con_grasa: 2,
  leguminosas: 1,
  aoa_c: 3,
  leche_b: 2,
  grasa_a: 3,
  azucares: 1,
  ...overrides,
})

// Totales esperados para buildCompleto(), calculados a mano con los valores
// reales de EQUIVALENTES_NUTRICIONALES (kcal, proteinas, grasas, carbohidratos):
// verdura 4×(25,2,0,4) + fruta 3×(60,0,0,15) + cereal_sin_grasa 6×(70,2,0,15)
// + cereal_con_grasa 2×(115,2,5,15) + leguminosas 1×(120,8,1,20)
// + aoa_c 3×(75,7,5,0) + leche_b 2×(110,9,4,12) + grasa_a 3×(45,0,5,0)
// + azucares 1×(40,0,0,10)
const TOTALES_ESPERADOS = {
  kcal: 4 * 25 + 3 * 60 + 6 * 70 + 2 * 115 + 1 * 120 + 3 * 75 + 2 * 110 + 3 * 45 + 1 * 40,
  proteinas: 4 * 2 + 3 * 0 + 6 * 2 + 2 * 2 + 1 * 8 + 3 * 7 + 2 * 9 + 3 * 0 + 1 * 0,
  grasas: 4 * 0 + 3 * 0 + 6 * 0 + 2 * 5 + 1 * 1 + 3 * 5 + 2 * 4 + 3 * 5 + 1 * 0,
  carbohidratos: 4 * 4 + 3 * 15 + 6 * 15 + 2 * 15 + 1 * 20 + 3 * 0 + 2 * 12 + 3 * 0 + 1 * 10,
}

describe('GET /nutricion/cal-get-nutr', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/cal-get-nutr')
    expect(res.status).toBe(401)
  })

  test('422 — rechaza si falta historia_paciente_id', async () => {
    const res = await agent.get('/nutricion/cal-get-nutr')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent.get('/nutricion/cal-get-nutr?historia_paciente_id=no-es-uuid')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get(`/nutricion/cal-get-nutr?historia_paciente_id=${historiaId}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('registros')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.registros)).toBe(true)
  })

  test('200 — filtra por historia_paciente_id', async () => {
    const created = await agent.post('/nutricion/cal-get-nutr').send(buildMinimal())
    expect(created.status).toBe(201)
    tracker.track('cal_get_nutr', uuidToBuffer(created.body.registro.id))

    const res = await agent.get(`/nutricion/cal-get-nutr?historia_paciente_id=${historiaId}`)
    expect(res.status).toBe(200)
    expect(res.body.registros.length).toBeGreaterThan(0)
    for (const r of res.body.registros) {
      expect(r.historia_paciente_id).toBe(historiaId)
    }
  })
})

describe('GET /nutricion/cal-get-nutr/:id', () => {
  test('404 — registro no existe', async () => {
    const res = await agent.get(`/nutricion/cal-get-nutr/${NIL_UUID}`)
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

describe('POST /nutricion/cal-get-nutr', () => {
  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/cal-get-nutr').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/cal-get-nutr')
      .send(buildMinimal({ historia_paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('422 — rechaza cantidades fuera de rango', async () => {
    const res = await agent.post('/nutricion/cal-get-nutr').send(buildMinimal({ verdura: 999 }))
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('201 — crea registro sin cantidades (todo en 0)', async () => {
    const res = await agent.post('/nutricion/cal-get-nutr').send(buildMinimal())
    expect(res.status).toBe(201)
    const r = res.body.registro
    expect(r.id).toBeDefined()
    expect(r.historia_paciente_id).toBe(historiaId)
    expect(r.paciente_id).toBeDefined()
    expect(r.total_kcal).toBe(0)
    expect(r.total_proteinas).toBe(0)
    expect(r.total_grasas).toBe(0)
    expect(r.total_carbohidratos).toBe(0)

    tracker.track('cal_get_nutr', uuidToBuffer(r.id))
  })

  test('201 — crea registro y calcula los totales correctamente', async () => {
    const res = await agent.post('/nutricion/cal-get-nutr').send(buildCompleto())
    expect(res.status).toBe(201)
    const r = res.body.registro
    expect(r.historia_paciente_id).toBe(historiaId)
    expect(r.verdura).toBe(4)
    expect(r.total_kcal).toBe(TOTALES_ESPERADOS.kcal)
    expect(r.total_proteinas).toBe(TOTALES_ESPERADOS.proteinas)
    expect(r.total_grasas).toBe(TOTALES_ESPERADOS.grasas)
    expect(r.total_carbohidratos).toBe(TOTALES_ESPERADOS.carbohidratos)

    tracker.track('cal_get_nutr', uuidToBuffer(r.id))
  })
})

describe('PATCH /nutricion/cal-get-nutr/:id', () => {
  let registroId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/cal-get-nutr').send(buildCompleto())
    registroId = res.body.registro?.id
    if (!registroId) throw new Error(`No se pudo crear registro para PATCH. status=${res.status}`)
    tracker.track('cal_get_nutr', uuidToBuffer(registroId))
  })

  test('200 — actualiza una cantidad y recalcula los totales', async () => {
    // Solo cambia verdura de 4 a 10 (+6 unidades × 25 kcal, 2 prot, 0 grasa, 4 carb)
    const res = await agent.patch(`/nutricion/cal-get-nutr/${registroId}`).send({ verdura: 10 })
    expect(res.status).toBe(200)
    expect(res.body.verdura).toBe(10)
    expect(res.body.total_kcal).toBe(TOTALES_ESPERADOS.kcal + 6 * 25)
    expect(res.body.total_proteinas).toBe(TOTALES_ESPERADOS.proteinas + 6 * 2)
    expect(res.body.total_carbohidratos).toBe(TOTALES_ESPERADOS.carbohidratos + 6 * 4)
  })

  test('200 — actualiza fecha_eval sin tocar las cantidades', async () => {
    const res = await agent
      .patch(`/nutricion/cal-get-nutr/${registroId}`)
      .send({ fecha_eval: '2024-06-01' })
    expect(res.status).toBe(200)
    expect(res.body.verdura).toBe(10)
  })

  test('404 — registro no existe', async () => {
    const res = await agent.patch(`/nutricion/cal-get-nutr/${NIL_UUID}`).send({ verdura: 5 })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /nutricion/cal-get-nutr/:id', () => {
  let registroId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/cal-get-nutr').send(buildCompleto())
    registroId = res.body.registro?.id
    if (!registroId) throw new Error(`No se pudo crear registro para DELETE. status=${res.status}`)
    tracker.track('cal_get_nutr', uuidToBuffer(registroId))
  })

  test('404 — registro no existe', async () => {
    const res = await agent.delete(`/nutricion/cal-get-nutr/${NIL_UUID}`)
    expect(res.status).toBe(404)
  })

  test('200 — elimina el registro', async () => {
    const res = await agent.delete(`/nutricion/cal-get-nutr/${registroId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()

    const check = await agent.get(`/nutricion/cal-get-nutr/${registroId}`)
    expect(check.status).toBe(404)

    const enDb = await prisma.cal_get_nutr.findUnique({
      where: { id: uuidToBuffer(registroId) },
    })
    expect(enDb).toBeNull()
  })
})
