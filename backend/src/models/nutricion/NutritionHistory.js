import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'

// ─── Relaciones a incluir en queries completas ───────────────────────────────

const includeRelations = {
  pacientes: { select: { nombre: true, apellidos: true } },
  adicciones: true,
  historias_medicas_nutricion: true,
  eval_act_fisica_nutricion: true,
  eval_cal_sueno: true,
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

// ─── Helpers de relaciones anidadas ──────────────────────────────────────────

function buildManyCreate(data, relations) {
  return relations.reduce((acc, key) => {
    if (data[key] !== undefined) {
      acc[key] = { create: data[key] }
    }
    return acc
  }, {})
}

function buildManyReplace(data, relations) {
  return relations.reduce((acc, key) => {
    if (data[key] !== undefined) {
      acc[key] = { deleteMany: {}, create: data[key] }
    }
    return acc
  }, {})
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatNutritionHistory(n) {
  if (!n) return null
  return {
    ...n,
    id: toUUID(n.id),
    paciente_id: toUUID(n.paciente_id),
    usuario_id: n.usuario_id ? toUUID(n.usuario_id) : null,
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
        ...(data.adicciones_id !== undefined && { adicciones_id: data.adicciones_id }),
        ...buildManyCreate(data, MANY_RELATIONS),
      },
    })

    return this.getById(historyId, tx)
  }

  /**
   * Elimina una historia por su UUID.
   *
   * Prisma usa su propio query interpreter con el adapter de MariaDB, por lo que
   * el ON DELETE CASCADE definido en el SQL no se aplica automáticamente al pasar
   * por Prisma. Los hijos se eliminan manualmente antes que el padre.
   *
   * Cuando el schema.prisma se actualice con onDelete: Cascade en las 4 relaciones
   * hijas, este método puede simplificarse a un delete directo.
   */
  static async delete(id, tx = prisma) {
    try {
      const idBuffer = uuidToBuffer(id)

      const history = await tx.historias_pacientes_nutricion.findUnique({
        where: { id: idBuffer },
        include: includeRelations,
      })
      if (!history) return null

      const where = { historia_paciente_id: idBuffer }
      await Promise.all([
        tx.historias_medicas_nutricion.deleteMany({ where }),
        tx.eval_act_fisica_nutricion.deleteMany({ where }),
        tx.eval_cal_sueno.deleteMany({ where }),
        tx.tratamiento_alt_nutricion.deleteMany({ where }),
      ])

      await tx.historias_pacientes_nutricion.delete({ where: { id: idBuffer } })

      return formatNutritionHistory(history)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data, tx = prisma) {
    try {
      await tx.historias_pacientes_nutricion.update({
        where: { id: uuidToBuffer(id) },
        data: {
          ...(data.fecha_ingreso !== undefined && { fecha_ingreso: data.fecha_ingreso }),
          ...(data.motivo_consulta !== undefined && { motivo_consulta: data.motivo_consulta }),
          ...(data.adicciones_id !== undefined && { adicciones_id: data.adicciones_id }),
          ...buildManyReplace(data, MANY_RELATIONS),
        },
      })
      return this.getById(id, tx)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
