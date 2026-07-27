import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'

// Grupos de intercambio guardados en cal_get_nutr. Los totales (total_kcal,
// total_proteinas, total_carbohidratos) NO se calculan aquí: los agrega
// automáticamente la Prisma Client Extension aplicada sobre `prisma` en
// #config/prisma.js (ver lib/calGetNutrExtension.js). Este modelo solo lee y
// escribe las cantidades crudas.
const CAMPOS_EQUIVALENTES = [
  'verdura',
  'fruta',
  'cereal_sin_grasa',
  'cereal_con_grasa',
  'leguminosas',
  'aoa_a',
  'aoa_b',
  'aoa_c',
  'aoa_d',
  'leche_a',
  'leche_b',
  'leche_c',
  'grasa_a',
  'grasa_b',
  'azucares',
  'rice_dream',
  'silk',
  'soyactive',
  'almond_breeze',
  'aube_baja',
  'nan_one',
  'aube_alta',
]

function pickCampos(data) {
  return Object.fromEntries(
    CAMPOS_EQUIVALENTES.filter((c) => data[c] !== undefined).map((c) => [c, data[c]])
  )
}

function formatCalGetNutr(n, paciente_id) {
  if (!n) return null
  return {
    ...n,
    historia_paciente_id: toUUID(n.historia_paciente_id),
    ...(paciente_id ? { paciente_id } : {}),
  }
}

/**
 * Resuelve el paciente dueño de una historia de nutrición.
 */
async function getPacienteId(historiaPacienteId, tx) {
  const historia = await tx.historias_pacientes_nutricion.findUnique({
    where: { id: uuidToBuffer(historiaPacienteId) },
    select: { paciente_id: true },
  })
  if (!historia) throw new NotFoundError('la historia del paciente')
  return toUUID(historia.paciente_id)
}

export class CalGetNutrModel {
  static async getAll({ historia_paciente_id, page, limit } = {}) {
    const where = {}
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const offset = (page - 1) * limit

    const [registros, total] = await prisma.$transaction([
      prisma.cal_get_nutr.findMany({
        where,
        orderBy: [{ fecha_eval: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.cal_get_nutr.count({ where }),
    ])

    return { registros: registros.map((r) => formatCalGetNutr(r)), count: total }
  }

  static async getById(id, tx = prisma) {
    const registro = await tx.cal_get_nutr.findUnique({ where: { id: Number(id) } })
    if (!registro) throw new NotFoundError('el cálculo de GET nutricional')
    return formatCalGetNutr(registro)
  }

  static async create(data, tx = prisma) {
    const paciente_id = await getPacienteId(data.historia_paciente_id, tx)

    const created = await tx.cal_get_nutr.create({
      data: {
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        fecha_eval: data.fecha_eval,
        ...pickCampos(data),
      },
    })

    return formatCalGetNutr(created, paciente_id)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.cal_get_nutr.findUnique({ where: { id: Number(id) } })
    if (!existing) throw new NotFoundError('el cálculo de GET nutricional')

    const paciente_id = await getPacienteId(toUUID(existing.historia_paciente_id), tx)
    await tx.cal_get_nutr.delete({ where: { id: Number(id) } })

    return formatCalGetNutr(existing, paciente_id)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.cal_get_nutr.findUnique({ where: { id: Number(id) } })
    if (!existing) throw new NotFoundError('el cálculo de GET nutricional')

    await tx.cal_get_nutr.update({
      where: { id: Number(id) },
      data: {
        ...(data.fecha_eval !== undefined && { fecha_eval: data.fecha_eval }),
        ...pickCampos(data),
      },
    })

    const paciente_id = await getPacienteId(toUUID(existing.historia_paciente_id), tx)
    const updated = await this.getById(id, tx)
    return { ...updated, paciente_id }
  }
}
