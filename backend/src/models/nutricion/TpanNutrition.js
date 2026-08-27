import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { assertActiveNutritionHistory } from '#lib/historyGuard.js'
import { toDateOnly } from '#lib/dates.js'
import { buildListArgs } from '#lib/queryFeatures.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'

const selectBasic = {
  id: true,
  historia_paciente_id: true,
  fecha_eval: true,
}

// El TPAN enlaza a la historia; el paciente_id (y sus nombres) se resuelven
// desde la historia para auditar y tocar el registro del paciente.
const includeRelations = {
  historias_pacientes_nutricion: {
    select: { paciente_id: true, pacientes: { select: { nombre: true, apellidos: true } } },
  },
}

function formatTpan(t) {
  if (!t) return null
  const { historias_pacientes_nutricion, ...rest } = t
  return {
    ...rest,
    id: toUUID(t.id),
    historia_paciente_id: toUUID(t.historia_paciente_id),
    paciente_id: toUUID(historias_pacientes_nutricion?.paciente_id),
    fecha_eval: toDateOnly(t.fecha_eval),
    pacientes: historias_pacientes_nutricion?.pacientes,
  }
}

function formatMinimal(t) {
  const result = { ...t }
  if ('id' in t) result.id = toUUID(t.id)
  if ('historia_paciente_id' in t) result.historia_paciente_id = toUUID(t.historia_paciente_id)
  if ('fecha_eval' in t) result.fecha_eval = toDateOnly(t.fecha_eval)
  return result
}

export class TpanNutritionModel {
  static async getAll({ historia_paciente_id, page, limit, fields } = {}) {
    const where = { historias_pacientes_nutricion: { deleted_at: null } }
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [tpans, total] = await prisma.$transaction([
      prisma.tpan_nutricion.findMany({
        where,
        ...queryOptions,
        ...buildListArgs({ page, limit, orderBy: [{ fecha_eval: 'desc' }, { id: 'desc' }] }),
      }),
      prisma.tpan_nutricion.count({ where }),
    ])

    return { tpans: tpans.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const tpan = await tx.tpan_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!tpan) throw new NotFoundError('el TPAN')
    return formatTpan(tpan)
  }

  static async create(data, tx = prisma) {
    await assertActiveNutritionHistory(data.historia_paciente_id, tx)
    const { historia_paciente_id, ...rest } = data
    const created = await tx.tpan_nutricion.create({
      include: includeRelations,
      data: {
        ...rest,
        id: uuidToBuffer(randomUUID()),
        historia_paciente_id: uuidToBuffer(historia_paciente_id),
      },
    })
    return formatTpan(created)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.tpan_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('el TPAN')
    await tx.tpan_nutricion.delete({ where: { id: uuidToBuffer(id) } })
    return formatTpan(existing)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.tpan_nutricion.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('el TPAN')

    // historia_paciente_id no se actualiza (se descarta del spread).
    const { historia_paciente_id, ...rest } = data
    await tx.tpan_nutricion.update({ where: { id: uuidToBuffer(id) }, data: rest })
    return this.getById(id, tx)
  }
}
