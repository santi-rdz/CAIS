import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import {
  toUUID,
  nestedCreate,
  nestedUpsert,
  planesEstudioCreate,
  planesEstudioUpsert,
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

function buildNestedRelations(data, nestedFn) {
  const result = {}
  for (const key of NESTED_RELATIONS) {
    if (data[key]) result[key] = nestedFn(data[key])
  }
  return result
}

function formatNested(obj) {
  if (!obj) return null
  return { ...obj, historia_medica_id: toUUID(obj.historia_medica_id) }
}

function formatMedicalHistory(n) {
  if (!n) return null
  const {
    planes_estudio,
    antecedentes_familiares,
    antecedentes_patologicos,
    antecedentes_no_patologicos,
    aparatos_sistemas,
    informacion_fisica,
    inmunizaciones,
    servicios,
    ...rest
  } = n
  return {
    ...rest,
    id: toUUID(n.id),
    paciente_id: toUUID(n.paciente_id),
    antecedentes_familiares: formatNested(antecedentes_familiares),
    antecedentes_patologicos: formatNested(antecedentes_patologicos),
    antecedentes_no_patologicos: formatNested(antecedentes_no_patologicos),
    aparatos_sistemas: formatNested(aparatos_sistemas),
    informacion_fisica: formatNested(informacion_fisica),
    inmunizaciones: formatNested(inmunizaciones),
    servicios: formatNested(servicios),
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

  static async create(data, userId, tx = null) {
    const historyId = randomUUID()
    const pacienteBuffer = uuidToBuffer(data.paciente_id)

    const run = async (client) => {
      await client.historias_medicas.create({
        data: {
          id: uuidToBuffer(historyId),
          paciente_id: pacienteBuffer,
          creado_at: data.creado_at,
          tipo_sangre: data.tipo_sangre || null,
          vacunas_infancia_completas: data.vacunas_infancia_completas ?? null,
          motivo_consulta: data.motivo_consulta || null,
          historia_enfermedad_actual: data.historia_enfermedad_actual || null,
          ...buildNestedRelations(data, nestedCreate),
          ...(data.planes_estudio && {
            planes_estudio: planesEstudioCreate(data.planes_estudio, userId),
          }),
        },
      })

      await client.pacientes.update({
        where: { id: pacienteBuffer },
        data: { actualizado_at: new Date() },
      })

      return this.getById(historyId, client)
    }

    return tx ? run(tx) : prisma.$transaction(run)
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

  static async update(id, data, userId, tx = null) {
    const run = async (client) => {
      const { paciente_id } = await client.historias_medicas.update({
        where: { id: uuidToBuffer(id) },
        data: {
          ...(data.creado_at !== undefined && {
            creado_at: data.creado_at,
          }),
          tipo_sangre: data.tipo_sangre,
          vacunas_infancia_completas: data.vacunas_infancia_completas,
          motivo_consulta: data.motivo_consulta,
          historia_enfermedad_actual: data.historia_enfermedad_actual,
          ...buildNestedRelations(data, nestedUpsert),
          ...(data.planes_estudio && {
            planes_estudio: planesEstudioUpsert(data.planes_estudio, userId),
          }),
        },
        select: { paciente_id: true },
      })

      await client.pacientes.update({
        where: { id: paciente_id },
        data: { actualizado_at: new Date() },
      })

      return this.getById(id, client)
    }

    try {
      return tx ? await run(tx) : await prisma.$transaction(run)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
