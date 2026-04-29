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
  perfil_anemia_nutricion: true,
  perfil_endocrino: true,
  perfil_renal_electrolitos: true,
  perfil_lipidos: true,
  balance_acido_base: true,
  perfil_orina: true,
  perfil_inflamatorio: true,
  eval_estado_nutricion: true,
}

const selectBasic = {
  id: true,
  paciente_id: true,
  creado_at: true,
}

const NESTED_RELATIONS = [
  'perfil_anemia_nutricion',
  'perfil_endocrino',
  'perfil_renal_electrolitos',
  'perfil_lipidos',
  'balance_acido_base',
  'perfil_orina',
  'perfil_inflamatorio',
  'eval_estado_nutricion',
]

function formatBiochemicalEval(n) {
  if (!n) return null
  const { ...rest } = n
  return {
    ...rest,
    id: toUUID(n.id),
    paciente_id: toUUID(n.paciente_id),
  }
}

function formatMinimal(n) {
  const result = { ...n, id: toUUID(n.id) }
  if ('paciente_id' in n) result.paciente_id = toUUID(n.paciente_id)
  return result
}

export class BiochemicalEvalModel {
  static async getAll({ paciente_id, page, limit, fields } = {}) {
    const where = {}
    if (paciente_id) where.paciente_id = uuidToBuffer(paciente_id)

    const offset = (page - 1) * limit

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [evaluations, total] = await prisma.$transaction([
      prisma.eval_bioq_nutricion.findMany({
        where,
        ...queryOptions,
        orderBy: [{ creado_at: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.eval_bioq_nutricion.count({ where }),
    ])

    return { evalutations: evaluations.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const evaluation = await tx.eval_bioq_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatBiochemicalEval(evaluation)
  }

  static async create(data, userId, tx = prisma) {
    const evaluationId = randomUUID()

    await tx.eval_bioq_nutricion.create({
      data: {
        id: uuidToBuffer(evaluationId),
        paciente_id: uuidToBuffer(data.paciente_id),
        creado_at: data.creado_at,
        fecha: data.creado_at,
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedCreate),
      },
    })

    return this.getById(evaluationIdId, tx)
  }

  static async delete(id) {
    try {
      const evaluation = await prisma.eval_bioq_nutricion.delete({
        where: { id: uuidToBuffer(id) },
        include: includeRelations,
      })
      return formatBiochemicalEval(evaluation)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data, userId, tx = prisma) {
    try {
      await tx.eval_bioq_nutricion.update({
        where: { id: uuidToBuffer(id) },
        data: {
          ...(data.creado_at !== undefined && {
            creado_at: data.creado_at,
          }),
          ...buildNestedRelations(data, NESTED_RELATIONS, nestedUpsert),
        },
      })
      return this.getById(id, tx)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
