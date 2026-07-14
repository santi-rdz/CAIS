import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
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
    pacientes: historias_pacientes_nutricion?.pacientes,
  }
}

function formatMinimal(t) {
  const result = { ...t }
  if ('id' in t) result.id = toUUID(t.id)
  if ('historia_paciente_id' in t) result.historia_paciente_id = toUUID(t.historia_paciente_id)
  return result
}

export class TpanNutritionModel {
  static async getAll({ historia_paciente_id, page, limit, fields } = {}) {
    const where = {}
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const offset = (page - 1) * limit

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [tpans, total] = await prisma.$transaction([
      prisma.tpan_nutricion.findMany({
        where,
        ...queryOptions,
        orderBy: [{ fecha_eval: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
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
    const tpanId = randomUUID()
    const created = await tx.tpan_nutricion.create({
      include: includeRelations,
      data: {
        id: uuidToBuffer(tpanId),
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        ...(data.fecha_eval !== undefined && { fecha_eval: data.fecha_eval }),
        ...(data.eval_realizada !== undefined && { eval_realizada: data.eval_realizada }),
        ...(data.observacion !== undefined && { observacion: data.observacion }),
        ...(data.estandares_com !== undefined && { estandares_com: data.estandares_com }),
        ...(data.decision !== undefined && { decision: data.decision }),
        ...(data.problema_iden !== undefined && { problema_iden: data.problema_iden }),
        ...(data.causa_probl !== undefined && { causa_probl: data.causa_probl }),
        ...(data.evidencia_probl !== undefined && { evidencia_probl: data.evidencia_probl }),
        ...(data.progreso !== undefined && { progreso: data.progreso }),
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

    await tx.tpan_nutricion.update({
      where: { id: uuidToBuffer(id) },
      data: {
        ...(data.fecha_eval !== undefined && { fecha_eval: data.fecha_eval }),
        ...(data.eval_realizada !== undefined && { eval_realizada: data.eval_realizada }),
        ...(data.observacion !== undefined && { observacion: data.observacion }),
        ...(data.estandares_com !== undefined && { estandares_com: data.estandares_com }),
        ...(data.decision !== undefined && { decision: data.decision }),
        ...(data.problema_iden !== undefined && { problema_iden: data.problema_iden }),
        ...(data.causa_probl !== undefined && { causa_probl: data.causa_probl }),
        ...(data.evidencia_probl !== undefined && { evidencia_probl: data.evidencia_probl }),
        ...(data.progreso !== undefined && { progreso: data.progreso }),
      },
    })
    return this.getById(id, tx)
  }
}
