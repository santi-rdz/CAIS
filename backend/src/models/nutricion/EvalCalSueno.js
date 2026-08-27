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
  fecha: true,
}

// La evaluación enlaza a la historia; el paciente_id se resuelve desde la
// historia para auditar y tocar el registro del paciente en el controlador.
const includeRelations = {
  historias_pacientes_nutricion: { select: { paciente_id: true } },
}

function formatSueno(s) {
  if (!s) return null
  const { historias_pacientes_nutricion, ...rest } = s
  return {
    ...rest,
    id: toUUID(s.id),
    historia_paciente_id: toUUID(s.historia_paciente_id),
    paciente_id: toUUID(historias_pacientes_nutricion?.paciente_id),
    fecha: toDateOnly(s.fecha),
  }
}

function formatMinimal(s) {
  const result = { ...s, id: toUUID(s.id), fecha: toDateOnly(s.fecha) }
  if ('historia_paciente_id' in s) result.historia_paciente_id = toUUID(s.historia_paciente_id)
  return result
}

export class EvalCalSuenoModel {
  static async getAll({ historia_paciente_id, page, limit, fields } = {}) {
    const where = { historias_pacientes_nutricion: { deleted_at: null } }
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [evaluaciones, total] = await prisma.$transaction([
      prisma.eval_cal_sueno.findMany({
        where,
        ...queryOptions,
        ...buildListArgs({ page, limit, orderBy: [{ fecha: 'desc' }, { id: 'desc' }] }),
      }),
      prisma.eval_cal_sueno.count({ where }),
    ])

    return { evaluaciones: evaluaciones.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const evaluacion = await tx.eval_cal_sueno.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!evaluacion) throw new NotFoundError('la evaluación de sueño')
    return formatSueno(evaluacion)
  }

  static async create(data, tx = prisma) {
    await assertActiveNutritionHistory(data.historia_paciente_id, tx)
    const { historia_paciente_id, ...rest } = data
    const evaluacionId = randomUUID()
    await tx.eval_cal_sueno.create({
      data: {
        ...rest,
        id: uuidToBuffer(evaluacionId),
        historia_paciente_id: uuidToBuffer(historia_paciente_id),
      },
    })
    return this.getById(evaluacionId, tx)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.eval_cal_sueno.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la evaluación de sueño')
    await tx.eval_cal_sueno.delete({ where: { id: uuidToBuffer(id) } })
    return formatSueno(existing)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.eval_cal_sueno.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('la evaluación de sueño')

    // historia_paciente_id no se actualiza (se descarta del spread).
    const { historia_paciente_id, ...rest } = data
    await tx.eval_cal_sueno.update({ where: { id: uuidToBuffer(id) }, data: rest })
    return this.getById(id, tx)
  }
}
