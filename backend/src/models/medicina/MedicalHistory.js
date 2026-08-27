import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { buildListArgs } from '#lib/queryFeatures.js'
import { uuidToBuffer } from '#lib/uuid.js'
import {
  toUUID,
  nestedCreate,
  nestedUpsert,
  planesEstudioCreate,
  planesEstudioUpsert,
  buildNestedRelations,
} from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'
import { toDateOnly, withDateOnly } from '#lib/dates.js'

// Fechas de vacunación (@db.Timestamp) — se emiten como fecha-sola.
const INMUNIZACION_DATES = ['influenza', 'tetanos', 'hepatitis_b', 'covid_19']

const includeRelations = {
  usuarios: { select: { nombre: true, foto: true } },
  antecedentes_familiares: true,
  antecedentes_patologicos: true,
  antecedentes_no_patologicos: true,
  aparatos_sistemas: true,
  informacion_fisica: true,
  inmunizaciones: true,
  planes_estudio: { include: { planes_estudio_cie10: true } },
  servicios: true,
}

const selectBasic = {
  id: true,
  paciente_id: true,
  expedida_en: true,
}

const NESTED_RELATIONS = [
  'antecedentes_familiares',
  'antecedentes_patologicos',
  'antecedentes_no_patologicos',
  'aparatos_sistemas',
  'informacion_fisica',
  'inmunizaciones',
  'servicios',
]

function formatMedicalHistory(n) {
  if (!n) return null
  const { planes_estudio, ...rest } = n
  return {
    ...rest,
    id: toUUID(n.id),
    paciente_id: toUUID(n.paciente_id),
    expedida_en: toDateOnly(n.expedida_en),
    inmunizaciones: withDateOnly(n.inmunizaciones, INMUNIZACION_DATES),

    usuario_id: n.usuario_id ? toUUID(n.usuario_id) : null,
    planes_estudio: planes_estudio
      ? {
          ...planes_estudio,
          historia_medica_id: undefined,
          cie10_codes:
            planes_estudio.planes_estudio_cie10?.map(({ codigo, descripcion }) => ({
              codigo,
              descripcion,
            })) ?? [],
          planes_estudio_cie10: undefined,
        }
      : null,
  }
}

function formatMinimal(n) {
  const result = { ...n, id: toUUID(n.id), expedida_en: toDateOnly(n.expedida_en) }
  if ('paciente_id' in n) result.paciente_id = toUUID(n.paciente_id)
  return result
}

export class MedicalHistoryModel {
  static async getAll({ paciente_id, page, limit, fields } = {}) {
    const where = { deleted_at: null }
    if (paciente_id) where.paciente_id = uuidToBuffer(paciente_id)

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [histories, total] = await prisma.$transaction([
      prisma.historias_medicas.findMany({
        where,
        ...queryOptions,
        ...buildListArgs({ page, limit, orderBy: [{ expedida_en: 'desc' }, { id: 'desc' }] }),
      }),
      prisma.historias_medicas.count({ where }),
    ])

    return { histories: histories.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const history = await tx.historias_medicas.findFirst({
      where: { id: uuidToBuffer(id), deleted_at: null },
      include: includeRelations,
    })
    if (!history) throw new NotFoundError('la historia médica')
    return formatMedicalHistory(history)
  }

  static async create(data, userId, tx = prisma) {
    const historyId = randomUUID()

    const { paciente_id, planes_estudio, ...rest } = data
    await tx.historias_medicas.create({
      data: {
        ...rest,
        id: uuidToBuffer(historyId),
        paciente_id: uuidToBuffer(paciente_id),
        usuario_id: uuidToBuffer(userId),
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedCreate),
        ...(planes_estudio && { planes_estudio: planesEstudioCreate(planes_estudio) }),
      },
    })

    return this.getById(historyId, tx)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.historias_medicas.findFirst({
      where: { id: uuidToBuffer(id), deleted_at: null },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la historia médica')
    await tx.historias_medicas.update({
      where: { id: uuidToBuffer(id) },
      data: { deleted_at: new Date() },
    })
    return formatMedicalHistory(existing)
  }

  static async update(id, data, userId, tx = prisma) {
    const existing = await tx.historias_medicas.findFirst({
      where: { id: uuidToBuffer(id), deleted_at: null },
    })
    if (!existing) throw new NotFoundError('la historia médica')

    // paciente_id no se actualiza (se descarta del spread).
    const { paciente_id, planes_estudio, ...rest } = data
    await tx.historias_medicas.update({
      where: { id: uuidToBuffer(id) },
      data: {
        ...rest,
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedUpsert),
        ...(planes_estudio && { planes_estudio: planesEstudioUpsert(planes_estudio) }),
      },
    })
    return this.getById(id, tx)
  }
}
