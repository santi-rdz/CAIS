import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'

const selectBasic = {
  id: true,
  paciente_id: true,
  fecha_eval: true,
}

const includeRelations = {
  pacientes: { select: { nombre: true, apellidos: true } },
}

function formatTpan(t) {
  if (!t) return null
  return {
    ...t,
    paciente_id: toUUID(t.paciente_id),
  }
}

function formatMinimal(t) {
  const result = { ...t }
  if ('paciente_id' in t) result.paciente_id = toUUID(t.paciente_id)
  return result
}

export class TpanNutritionModel {
  static async getAll({ paciente_id, page, limit, fields } = {}) {
    const where = {}
    if (paciente_id) where.paciente_id = uuidToBuffer(paciente_id)

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
      where: { id: Number(id) },
      include: includeRelations,
    })
    return formatTpan(tpan)
  }

  static async create(data, tx = prisma) {
    const tpan = await tx.tpan_nutricion.create({
      data: {
        paciente_id: uuidToBuffer(data.paciente_id),
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
    return this.getById(tpan.id, tx)
  }

  static async delete(id, tx = prisma) {
    try {
      const tpan = await tx.tpan_nutricion.delete({
        where: { id: Number(id) },
        include: includeRelations,
      })
      return formatTpan(tpan)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data, tx = prisma) {
    try {
      await tx.tpan_nutricion.update({
        where: { id: Number(id) },
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
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
