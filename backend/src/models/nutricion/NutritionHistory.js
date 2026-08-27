import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { buildListArgs } from '#lib/queryFeatures.js'
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
import { toDateOnly } from '#lib/dates.js'

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

// eval_cal_sueno y eval_act_fisica_nutricion usan id BINARY(16); al venir
// embebidos hay que castear su id (y la FK) a UUID string, si no llegan como
// Buffer crudo al FE (key de React rota + edición del wizard).
function formatChildIds(row) {
  return {
    ...row,
    id: toUUID(row.id),
    historia_paciente_id: toUUID(row.historia_paciente_id),
    fecha: toDateOnly(row.fecha),
  }
}

function formatNutritionHistory(n) {
  if (!n) return null
  return {
    ...n,
    id: toUUID(n.id),
    paciente_id: toUUID(n.paciente_id),
    fecha_ingreso: toDateOnly(n.fecha_ingreso),
    ...(n.eval_cal_sueno && { eval_cal_sueno: n.eval_cal_sueno.map(formatChildIds) }),
    ...(n.eval_act_fisica_nutricion && {
      eval_act_fisica_nutricion: n.eval_act_fisica_nutricion.map(formatChildIds),
    }),
  }
}

function formatMinimal(n) {
  const result = { ...n, id: toUUID(n.id), fecha_ingreso: toDateOnly(n.fecha_ingreso) }
  if ('paciente_id' in n) result.paciente_id = toUUID(n.paciente_id)
  return result
}

// ─── Modelo ──────────────────────────────────────────────────────────────────

export class NutritionHistoryModel {
  static async getAll({ paciente_id, page, limit, fields } = {}) {
    const where = { deleted_at: null }
    if (paciente_id) where.paciente_id = uuidToBuffer(paciente_id)

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [histories, total] = await prisma.$transaction([
      prisma.historias_pacientes_nutricion.findMany({
        where,
        ...queryOptions,
        ...buildListArgs({ page, limit, orderBy: [{ fecha_ingreso: 'desc' }, { id: 'desc' }] }),
      }),
      prisma.historias_pacientes_nutricion.count({ where }),
    ])

    return { histories: histories.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const history = await tx.historias_pacientes_nutricion.findFirst({
      where: { id: uuidToBuffer(id), deleted_at: null },
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

  // Soft delete: marca deleted_at y conserva las hijas (no cascadea). Se lee
  // antes con include para devolver el payload completo.
  static async delete(id, tx = prisma) {
    const idBuffer = uuidToBuffer(id)

    const history = await tx.historias_pacientes_nutricion.findFirst({
      where: { id: idBuffer, deleted_at: null },
      include: includeRelations,
    })
    if (!history) throw new NotFoundError('la historia de nutrición')

    await tx.historias_pacientes_nutricion.update({
      where: { id: idBuffer },
      data: { deleted_at: new Date() },
    })

    return formatNutritionHistory(history)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.historias_pacientes_nutricion.findFirst({
      where: { id: uuidToBuffer(id), deleted_at: null },
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
