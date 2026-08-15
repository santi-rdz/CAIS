/**
 * @file Tests de integración para el reporte EEN.
 *
 * A diferencia de AnthropometricEval (una tabla padre + kid/adulto como
 * hijas 1:1), aquí `reporte_een_kids_nutricion` y
 * `reporte_een_adulto_nutricion` son tablas independientes, cada una con su
 * propio historia_paciente_id — no hay fila padre compartida. El modelo
 * decide en cuál tabla insertar según la edad del paciente, y para
 * GET/PATCH/DELETE prueba primero en kid y luego en adulto (ver
 * ReporteEenModel.getById).
 *
 * El reporte de adulto además tiene `diagnosticos` anidados (1:N con
 * diagnostico_nutricional_adulto), igual que rec_24h_comidas: el PATCH
 * reemplaza la lista completa si se envía, no hace upsert por ítem.
 */

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

  const pacienteAdulto = await createTestPaciente({
    doctor: auth.user,
    tracker,
    overrides: { fecha_nacimiento: new Date('2000-01-01') },
  })
  const pacienteKid = await createTestPaciente({
    doctor: auth.user,
    tracker,
    overrides: { fecha_nacimiento: new Date('2015-01-01') },
  })

  const histAdultoRes = await agent
    .post('/nutricion/historias-nutricion')
    .send({ paciente_id: pacienteAdulto.id, motivo_consulta: 'Setup reporte EEN adulto' })
  historiaAdultoId = histAdultoRes.body.history?.id
  if (!historiaAdultoId) {
    throw new Error(`No se pudo crear historia adulto. status=${histAdultoRes.status}`)
  }
  tracker.track('historias_pacientes_nutricion', uuidToBuffer(historiaAdultoId))

  const histKidRes = await agent
    .post('/nutricion/historias-nutricion')
    .send({ paciente_id: pacienteKid.id, motivo_consulta: 'Setup reporte EEN kid' })
  historiaKidId = histKidRes.body.history?.id
  if (!historiaKidId) {
    throw new Error(`No se pudo crear historia kid. status=${histKidRes.status}`)
  }
  tracker.track('historias_pacientes_nutricion', uuidToBuffer(historiaKidId))
})

afterAll(() => tracker.cleanup())

const buildMinimalAdulto = (overrides = {}) => ({
  historia_paciente_id: historiaAdultoId,
  fecha_eval: '2024-05-10',
  adulto: {
    habitos_ali_obs: 'Come 3 veces al día, poca fibra',
    alteraciones_gastroin: 'Ninguna reportada',
  },
  ...overrides,
})

const buildCompletoAdulto = (overrides = {}) =>
  buildMinimalAdulto({
    adulto: {
      habitos_ali_obs: 'Come 3 veces al día, poca fibra',
      alteraciones_gastroin: 'Ninguna reportada',
      diagnosticos: [
        {
          pes: 'Ingesta inadecuada de fibra',
          intervencion: 'Educación nutricional',
          objetivos: 'Aumentar consumo de fibra a 25g/día',
          indicadores: 'Consumo diario de fibra',
          criterio: 'Reporte de consumo semanal',
          progreso: 'En progreso',
        },
      ],
    },
    ...overrides,
  })

const buildCompletoKid = (overrides = {}) => ({
  historia_paciente_id: historiaKidId,
  fecha_eval: '2024-05-10',
  kid: {
    eval_diag_edo_nutr: 'Eutrófico',
    solicito_orient: true,
    prescrip_nut_obs: 'Plan de alimentación balanceado',
    educ_nut_obs: 'Se explicó plato del bien comer',
    consejeria_nut_obs: 'Padres receptivos',
    coord_aten_nut_obs: 'Seguimiento en 3 meses',
  },
  ...overrides,
})

describe('GET /nutricion/reporte-een', () => {
  test('401 — sin sesión devuelve 401', async () => {
    const res = await api.get('/nutricion/reporte-een')
    expect(res.status).toBe(401)
  })

  test('422 — rechaza si falta historia_paciente_id', async () => {
    const res = await agent.get('/nutricion/reporte-een')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent.get('/nutricion/reporte-een?historia_paciente_id=no-es-uuid')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('200 — retorna lista paginada', async () => {
    const res = await agent.get(`/nutricion/reporte-een?historia_paciente_id=${historiaAdultoId}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('reportes')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.reportes)).toBe(true)
  })

  test('200 — filtra por historia_paciente_id', async () => {
    const created = await agent.post('/nutricion/reporte-een').send(buildMinimalAdulto())
    expect(created.status).toBe(201)
    tracker.track('reporte_een_adulto_nutricion', uuidToBuffer(created.body.reporte.id))

    const res = await agent.get(`/nutricion/reporte-een?historia_paciente_id=${historiaAdultoId}`)
    expect(res.status).toBe(200)
    expect(res.body.reportes.length).toBeGreaterThan(0)
    for (const r of res.body.reportes) {
      expect(r.historia_paciente_id).toBe(historiaAdultoId)
    }
  })
})

describe('GET /nutricion/reporte-een/:id', () => {
  test('404 — reporte no existe', async () => {
    const res = await agent.get('/nutricion/reporte-een/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message')
  })
})

describe('POST /nutricion/reporte-een', () => {
  test('422 — rechaza body vacío', async () => {
    const res = await agent.post('/nutricion/reporte-een').send({})
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza historia_paciente_id inválido', async () => {
    const res = await agent
      .post('/nutricion/reporte-een')
      .send(buildMinimalAdulto({ historia_paciente_id: 'no-es-uuid' }))
    expect(res.status).toBe(422)
  })

  test('422 — rechaza si no envía ni kid ni adulto', async () => {
    const res = await agent.post('/nutricion/reporte-een').send({
      historia_paciente_id: historiaAdultoId,
      fecha_eval: '2024-05-10',
    })
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza si envía kid y adulto a la vez', async () => {
    const res = await agent.post('/nutricion/reporte-een').send(
      buildMinimalAdulto({
        kid: { eval_diag_edo_nutr: 'Eutrófico' },
      })
    )
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — rechaza perfil "kid" para un paciente adulto', async () => {
    const res = await agent.post('/nutricion/reporte-een').send({
      historia_paciente_id: historiaAdultoId,
      fecha_eval: '2024-05-10',
      kid: { eval_diag_edo_nutr: 'Eutrófico' },
    })
    expect(res.status).toBe(422)
  })

  test('422 — rechaza perfil "adulto" para un paciente menor de edad', async () => {
    const res = await agent.post('/nutricion/reporte-een').send({
      historia_paciente_id: historiaKidId,
      fecha_eval: '2024-05-10',
      adulto: { habitos_ali_obs: 'Come bien' },
    })
    expect(res.status).toBe(422)
  })

  test('201 — crea reporte de adulto sin diagnósticos', async () => {
    const res = await agent.post('/nutricion/reporte-een').send(buildMinimalAdulto())
    expect(res.status).toBe(201)
    const r = res.body.reporte
    expect(r.id).toBeDefined()
    expect(r.tipo).toBe('adulto')
    expect(r.historia_paciente_id).toBe(historiaAdultoId)
    expect(r.paciente_id).toBeDefined()
    expect(r.diagnosticos).toEqual([])

    tracker.track('reporte_een_adulto_nutricion', uuidToBuffer(r.id))
  })

  test('201 — crea reporte de adulto con diagnósticos anidados', async () => {
    const res = await agent.post('/nutricion/reporte-een').send(buildCompletoAdulto())
    expect(res.status).toBe(201)
    const r = res.body.reporte
    expect(r.tipo).toBe('adulto')
    expect(r.diagnosticos).toHaveLength(1)
    expect(r.diagnosticos[0].pes).toBe('Ingesta inadecuada de fibra')

    tracker.track('reporte_een_adulto_nutricion', uuidToBuffer(r.id))
  })

  test('201 — crea reporte pediátrico (paciente menor de edad)', async () => {
    const res = await agent.post('/nutricion/reporte-een').send(buildCompletoKid())
    expect(res.status).toBe(201)
    const r = res.body.reporte
    expect(r.tipo).toBe('kid')
    expect(r.historia_paciente_id).toBe(historiaKidId)
    expect(r.eval_diag_edo_nutr).toBe('Eutrófico')

    tracker.track('reporte_een_kids_nutricion', uuidToBuffer(r.id))
  })
})

describe('GET /nutricion/reporte-een/:id — busca en ambas tablas', () => {
  test('200 — encuentra un reporte que vive en reporte_een_kids_nutricion', async () => {
    const created = await agent.post('/nutricion/reporte-een').send(buildCompletoKid())
    const id = created.body.reporte.id
    tracker.track('reporte_een_kids_nutricion', uuidToBuffer(id))

    const res = await agent.get(`/nutricion/reporte-een/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.tipo).toBe('kid')
  })

  test('200 — encuentra un reporte que vive en reporte_een_adulto_nutricion', async () => {
    const created = await agent.post('/nutricion/reporte-een').send(buildMinimalAdulto())
    const id = created.body.reporte.id
    tracker.track('reporte_een_adulto_nutricion', uuidToBuffer(id))

    const res = await agent.get(`/nutricion/reporte-een/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.tipo).toBe('adulto')
  })
})

describe('PATCH /nutricion/reporte-een/:id', () => {
  let reporteAdultoId
  let reporteKidId

  beforeAll(async () => {
    const resAdulto = await agent.post('/nutricion/reporte-een').send(buildCompletoAdulto())
    reporteAdultoId = resAdulto.body.reporte?.id
    if (!reporteAdultoId) {
      throw new Error(`No se pudo crear reporte adulto para PATCH. status=${resAdulto.status}`)
    }
    tracker.track('reporte_een_adulto_nutricion', uuidToBuffer(reporteAdultoId))

    const resKid = await agent.post('/nutricion/reporte-een').send(buildCompletoKid())
    reporteKidId = resKid.body.reporte?.id
    if (!reporteKidId) {
      throw new Error(`No se pudo crear reporte kid para PATCH. status=${resKid.status}`)
    }
    tracker.track('reporte_een_kids_nutricion', uuidToBuffer(reporteKidId))
  })

  test('200 — actualiza campos base del adulto sin tocar diagnósticos', async () => {
    const res = await agent
      .patch(`/nutricion/reporte-een/${reporteAdultoId}`)
      .send({ adulto: { habitos_ali_obs: 'Actualizado: mejoró el consumo de fibra' } })
    expect(res.status).toBe(200)
    expect(res.body.habitos_ali_obs).toBe('Actualizado: mejoró el consumo de fibra')
    expect(res.body.diagnosticos).toHaveLength(1)
  })

  test('200 — reemplaza la lista completa de diagnósticos', async () => {
    const res = await agent.patch(`/nutricion/reporte-een/${reporteAdultoId}`).send({
      adulto: {
        diagnosticos: [
          {
            pes: 'Nuevo diagnóstico',
            intervencion: 'Nueva intervención',
            objetivos: 'Nuevo objetivo',
            indicadores: 'Nuevo indicador',
            criterio: 'Nuevo criterio',
            progreso: 'Iniciado',
          },
        ],
      },
    })
    expect(res.status).toBe(200)
    expect(res.body.diagnosticos).toHaveLength(1)
    expect(res.body.diagnosticos[0].pes).toBe('Nuevo diagnóstico')
  })

  test('200 — vacía la lista de diagnósticos', async () => {
    const res = await agent
      .patch(`/nutricion/reporte-een/${reporteAdultoId}`)
      .send({ adulto: { diagnosticos: [] } })
    expect(res.status).toBe(200)
    expect(res.body.diagnosticos).toEqual([])
  })

  test('200 — actualiza fecha_eval', async () => {
    const res = await agent
      .patch(`/nutricion/reporte-een/${reporteAdultoId}`)
      .send({ fecha_eval: '2024-06-01' })
    expect(res.status).toBe(200)
  })

  test('200 — actualiza el reporte pediátrico', async () => {
    const res = await agent
      .patch(`/nutricion/reporte-een/${reporteKidId}`)
      .send({ kid: { eval_diag_edo_nutr: 'Riesgo de sobrepeso' } })
    expect(res.status).toBe(200)
    expect(res.body.eval_diag_edo_nutr).toBe('Riesgo de sobrepeso')
  })

  test('404 — reporte no existe', async () => {
    const res = await agent
      .patch('/nutricion/reporte-een/00000000-0000-0000-0000-000000000000')
      .send({ adulto: { habitos_ali_obs: 'x' } })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /nutricion/reporte-een/:id', () => {
  let reporteAdultoId

  beforeAll(async () => {
    const res = await agent.post('/nutricion/reporte-een').send(buildCompletoAdulto())
    reporteAdultoId = res.body.reporte?.id
    if (!reporteAdultoId) {
      throw new Error(`No se pudo crear reporte para DELETE. status=${res.status}`)
    }
    tracker.track('reporte_een_adulto_nutricion', uuidToBuffer(reporteAdultoId))
  })

  test('404 — reporte no existe', async () => {
    const res = await agent.delete('/nutricion/reporte-een/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
  })

  test('200 — elimina el reporte y sus diagnósticos en cascada', async () => {
    const reporteBuffer = uuidToBuffer(reporteAdultoId)
    const res = await agent.delete(`/nutricion/reporte-een/${reporteAdultoId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()

    const check = await agent.get(`/nutricion/reporte-een/${reporteAdultoId}`)
    expect(check.status).toBe(404)

    const diagnosticos = await prisma.diagnostico_nutricional_adulto.findMany({
      where: { reporte_een_id: reporteBuffer },
    })
    expect(diagnosticos).toHaveLength(0)
  })

  test('200 — elimina un reporte pediátrico (sin hijos que cascadear)', async () => {
    const created = await agent.post('/nutricion/reporte-een').send(buildCompletoKid())
    const id = created.body.reporte.id

    const res = await agent.delete(`/nutricion/reporte-een/${id}`)
    expect(res.status).toBe(200)

    const check = await agent.get(`/nutricion/reporte-een/${id}`)
    expect(check.status).toBe(404)
  })
})
