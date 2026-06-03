import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID, nestedCreate, nestedUpsert, buildNestedRelations } from '#lib/prismaHelpers.js'

const includeRelations = {
  eval_apetito_nutricion: true,
  frec_consumo_alimentos_nutricion: true,
  horarios_comida_nutricion: true,
}

const selectBasic = {
  id: true,
  paciente_id: true,
  fecha: true,
  creado_at: true,
}

const NESTED_RELATIONS = [
  'eval_apetito_nutricion',
  'frec_consumo_alimentos_nutricion',
  'horarios_comida_nutricion',
]

function formatEvalNutr(n) {
  if (!n) return null
  return {
    ...n,
    id: toUUID(n.id),
    paciente_id: toUUID(n.paciente_id),
  }
}

function formatMinimal(n) {
  const result = { ...n, id: toUUID(n.id) }
  if ('paciente_id' in n) result.paciente_id = toUUID(n.paciente_id)
  return result
}

export class NutritionalEvalModel {
  static async getAll({ paciente_id, page = 1, limit = 20, fields } = {}) {
    const where = {}
    if (paciente_id) where.paciente_id = uuidToBuffer(paciente_id)

    const offset = (page - 1) * limit

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [evals, total] = await prisma.$transaction([
      prisma.eval_nutr_fh.findMany({
        where,
        ...queryOptions,
        orderBy: [{ creado_at: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.eval_nutr_fh.count({ where }),
    ])

    return { evals: evals.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const evalNutr = await tx.eval_nutr_fh.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatEvalNutr(evalNutr)
  }

  static async create(data, tx = prisma) {
    const evalId = randomUUID()

    await tx.eval_nutr_fh.create({
      data: {
        id: uuidToBuffer(evalId),
        paciente_id: uuidToBuffer(data.paciente_id),
        fecha: data.fecha,
        sigue_dieta: data.sigue_dieta,
        tiene_alergia: data.tiene_alergia,
        cual_alergia: data.cual_alergia,
        alimentos_disgusta: data.alimentos_disgusta,
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedCreate),
      },
    })

    return this.getById(evalId, tx)
  }

  static async delete(id) {
    try {
      const evalNutr = await prisma.eval_nutr_fh.delete({
        where: { id: uuidToBuffer(id) },
        include: includeRelations,
      })
      return formatEvalNutr(evalNutr)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data, tx = prisma) {
    try {
      await tx.eval_nutr_fh.update({
        where: { id: uuidToBuffer(id) },
        data: {
          ...(data.fecha !== undefined && { fecha: data.fecha }),
          sigue_dieta: data.sigue_dieta,
          tiene_alergia: data.tiene_alergia,
          cual_alergia: data.cual_alergia,
          alimentos_disgusta: data.alimentos_disgusta,
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
