import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'

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

const ALLOWED_FIELDS = new Set(['id', 'paciente_id', 'fecha', 'creado_at'])

function formatNested(obj) {
  if (!obj) return null
  const { id_eval_bioq, ...rest } = obj
  return rest
}

function formatBiochemicalEval(n) {
  if (!n) return null
  return {
    id: toUUID(n.id),
    paciente_id: toUUID(n.paciente_id),
    fecha: n.fecha,
    creado_at: n.creado_at,
    perfil_anemia_nutricion: formatNested(n.perfil_anemia_nutricion),
    perfil_endocrino: formatNested(n.perfil_endocrino),
    perfil_renal_electrolitos: formatNested(n.perfil_renal_electrolitos),
    perfil_lipidos: formatNested(n.perfil_lipidos),
    balance_acido_base: formatNested(n.balance_acido_base),
    perfil_orina: formatNested(n.perfil_orina),
    perfil_inflamatorio: formatNested(n.perfil_inflamatorio),
    eval_estado_nutricion: formatNested(n.eval_estado_nutricion),
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

    const invalidFields = fields?.filter((f) => !ALLOWED_FIELDS.has(f))
    if (invalidFields?.length) {
      return { evaluations: [], count: 0 }
    }

    const queryOptions = {
      select: fields
        ? {
            id: true,
            ...Object.fromEntries(
              fields.filter((f) => ALLOWED_FIELDS.has(f)).map((f) => [f, true])
            ),
          }
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

    return { evaluations: evaluations.map(formatMinimal), count: total }
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
    const evalBuffer = uuidToBuffer(evaluationId)

    // 1. Crear la evaluación raíz primero
    await tx.eval_bioq_nutricion.create({
      data: {
        id: evalBuffer,
        paciente_id: uuidToBuffer(data.paciente_id),
        ...(data.fecha !== undefined && { fecha: data.fecha }),
      },
    })

    // 2. Crear los perfiles después (ya existe el padre)
    await Promise.all(
      NESTED_RELATIONS.filter((key) => data[key]).map((key) =>
        tx[key].create({
          data: { ...data[key], id_eval_bioq: evalBuffer },
        })
      )
    )

    return this.getById(evaluationId, tx)
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
      const evalBuffer = uuidToBuffer(id)

      const exists = await tx.eval_bioq_nutricion.findUnique({
        where: { id: evalBuffer },
      })
      if (!exists) return null

      await Promise.all([
        tx.eval_bioq_nutricion.update({
          where: { id: evalBuffer },
          data: {
            ...(data.fecha !== undefined && { fecha: data.fecha }),
          },
        }),
        ...NESTED_RELATIONS.filter((key) => data[key]).map((key) =>
          tx[key].upsert({
            where: { id_eval_bioq: evalBuffer },
            create: { ...data[key], id_eval_bioq: evalBuffer },
            update: { ...data[key] },
          })
        ),
      ])

      return this.getById(id, tx)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
