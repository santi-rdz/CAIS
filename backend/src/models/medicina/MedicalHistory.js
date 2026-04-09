import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import {
  toUUID,
  nestedCreate,
  nestedUpsert,
  planesEstudioCreate,
  planesEstudioUpsert,
  buildNestedRelations,
} from '#lib/prismaHelpers.js'

const includeRelations = {
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
  creado_at: true,
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

    planes_estudio: planes_estudio
      ? {
          ...planes_estudio,
          id: toUUID(planes_estudio.id),
          usuario_id: toUUID(planes_estudio.usuario_id),
          historia_medica_id: toUUID(planes_estudio.historia_medica_id),
          cie10_codes:
            planes_estudio.planes_estudio_cie10?.map(
              ({ codigo, descripcion }) => ({ codigo, descripcion })
            ) ?? [],
          planes_estudio_cie10: undefined,
        }
      : null,
  }
}

function formatMinimal(n) {
  const result = { ...n, id: toUUID(n.id) }
  if ('paciente_id' in n) result.paciente_id = toUUID(n.paciente_id)
  return result
}

export class MedicalHistoryModel {
  static async getAll({ paciente_id, page, limit, fields } = {}) {
    const where = {}
    if (paciente_id) where.paciente_id = uuidToBuffer(paciente_id)

    const offset = (page - 1) * limit

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [histories, total] = await prisma.$transaction([
      prisma.historias_medicas.findMany({
        where,
        ...queryOptions,
        orderBy: [{ creado_at: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.historias_medicas.count({ where }),
    ])

    return { histories: histories.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const history = await tx.historias_medicas.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatMedicalHistory(history)
  }

  static async create(data, userId, tx = prisma) {
    const historyId = randomUUID()

    await tx.historias_medicas.create({
      data: {
        id: uuidToBuffer(historyId),
        paciente_id: uuidToBuffer(data.paciente_id),
        creado_at: data.creado_at,
        tipo_sangre: data.tipo_sangre,
        vacunas_infancia_completas: data.vacunas_infancia_completas,
        motivo_consulta: data.motivo_consulta,
        historia_enfermedad_actual: data.historia_enfermedad_actual,
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedCreate),
        ...(data.planes_estudio && {
          planes_estudio: planesEstudioCreate(data.planes_estudio, userId),
        }),
      },
    })

    return this.getById(historyId, tx)
  }

  static async delete(id) {
    try {
      const history = await prisma.historias_medicas.delete({
        where: { id: uuidToBuffer(id) },
        include: includeRelations,
      })
      return formatMedicalHistory(history)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data, userId, tx = prisma) {
    try {
      await tx.historias_medicas.update({
        where: { id: uuidToBuffer(id) },
        data: {
          ...(data.creado_at !== undefined && {
            creado_at: data.creado_at,
          }),
          tipo_sangre: data.tipo_sangre,
          vacunas_infancia_completas: data.vacunas_infancia_completas,
          motivo_consulta: data.motivo_consulta,
          historia_enfermedad_actual: data.historia_enfermedad_actual,
          ...buildNestedRelations(data, NESTED_RELATIONS, nestedUpsert),
          ...(data.planes_estudio && {
            planes_estudio: planesEstudioUpsert(data.planes_estudio, userId),
          }),
        },
      })
      return this.getById(id, tx)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
