import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import {
  toUUID,
  nestedCreate,
  nestedUpsert,
  buildNestedRelations,
  manyCreate,
  manyReplace,
} from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'

// ─── Relaciones a incluir en queries completas ───────────────────────────────

const includeRelations = {
  pacientes: { select: { nombre: true, apellidos: true } },
  adicciones: true,
  historias_medicas_nutricion: true,
  eval_act_fisica_nutricion: { orderBy: { id: 'desc' } },
  eval_cal_sueno: { orderBy: { id: 'desc' } },
  tratamiento_alt_nutricion: true,
}

// ─── Campos mínimos para listados paginados ───────────────────────────────────

const selectBasic = {
  id: true,
  paciente_id: true,
  fecha_ingreso: true,
}

// ─── Relaciones one-to-many ───────────────────────────────────────────────────

const MANY_RELATIONS = [
  'historias_medicas_nutricion',
  'eval_act_fisica_nutricion',
  'eval_cal_sueno',
  'tratamiento_alt_nutricion',
]

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatNutritionHistory(n) {
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

// ─── Modelo ──────────────────────────────────────────────────────────────────

export class NutritionHistoryModel {
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
      prisma.historias_pacientes_nutricion.findMany({
        where,
        ...queryOptions,
        orderBy: [{ fecha_ingreso: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.historias_pacientes_nutricion.count({ where }),
    ])

    return { histories: histories.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const history = await tx.historias_pacientes_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!history) throw new NotFoundError('la historia de nutrición')
    return formatNutritionHistory(history)
  }

  static async create(data, tx = prisma) {
    const historyId = randomUUID()

    await tx.historias_pacientes_nutricion.create({
      data: {
        id: uuidToBuffer(historyId),
        paciente_id: uuidToBuffer(data.paciente_id),
        fecha_ingreso: data.fecha_ingreso,
        motivo_consulta: data.motivo_consulta,
        ...(data.adicciones && { adicciones: nestedCreate(data.adicciones) }),
        ...buildNestedRelations(data, MANY_RELATIONS, manyCreate),
      },
    })

    return this.getById(historyId, tx)
  }

  // Todas las hijas (adicciones, historias_medicas_nutricion, eval_*, tratamiento,
  // eval_bioq, eval_nutr, tpan, exam_fis) guardan historia_paciente_id con
  // ON DELETE CASCADE → un delete plano las arrastra. Se lee antes con include
  // para devolver el payload completo.
  static async delete(id, tx = prisma) {
    const idBuffer = uuidToBuffer(id)

    const history = await tx.historias_pacientes_nutricion.findUnique({
      where: { id: idBuffer },
      include: includeRelations,
    })
    if (!history) throw new NotFoundError('la historia de nutrición')

    await tx.historias_pacientes_nutricion.delete({ where: { id: idBuffer } })

    return formatNutritionHistory(history)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.historias_pacientes_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
    })
    if (!existing) throw new NotFoundError('la historia de nutrición')

    await tx.historias_pacientes_nutricion.update({
      where: { id: uuidToBuffer(id) },
      data: {
        ...(data.fecha_ingreso !== undefined && { fecha_ingreso: data.fecha_ingreso }),
        ...(data.motivo_consulta !== undefined && { motivo_consulta: data.motivo_consulta }),
        ...(data.adicciones && { adicciones: nestedUpsert(data.adicciones) }),
        ...buildNestedRelations(data, MANY_RELATIONS, manyReplace),
      },
    })
    return this.getById(id, tx)
  }
}
