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
    return formatNutritionHistory(history)
  }

  static async create(data, tx = prisma) {
    const historyId = randomUUID()

    await tx.historias_pacientes_nutricion.create({
      data: {
        id: uuidToBuffer(historyId),
        // connect (modo checked) para habilitar el create anidado de adicciones,
        // que es una relación to-one padre (FK adicciones_id en esta fila).
        pacientes: { connect: { id: uuidToBuffer(data.paciente_id) } },
        fecha_ingreso: data.fecha_ingreso,
        motivo_consulta: data.motivo_consulta,
        ...(data.adicciones && { adicciones: nestedCreate(data.adicciones) }),
        ...buildNestedRelations(data, MANY_RELATIONS, manyCreate),
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

      // adicciones es 1:1 propiedad de la historia (FK adicciones_id en la
      // historia); se borra después de la historia para no violar la FK.
      if (history.adicciones?.id) {
        await tx.adicciones.delete({ where: { id: history.adicciones.id } }).catch((err) => {
          if (err.code !== 'P2025') throw err
        })
      }

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
          ...(data.adicciones && { adicciones: nestedUpsert(data.adicciones) }),
          ...buildNestedRelations(data, MANY_RELATIONS, manyReplace),
        },
      })
      return this.getById(id, tx)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
