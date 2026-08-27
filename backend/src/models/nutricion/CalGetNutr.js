import { GRUPOS_EQUIVALENTES } from '@cais/shared/constants/nutricion'
import { prisma } from '#config/prisma.js'
import { assertActiveNutritionHistory } from '#lib/historyGuard.js'
import { buildListArgs } from '#lib/queryFeatures.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'
import { toDateOnly } from '#lib/dates.js'

// Campos que el modelo lee/escribe crudos en cal_get_nutr. Los derivados
// (total_* y objetivos) NO se calculan aquí: los agrega la Prisma Client
// Extension sobre `prisma` (ver #config/CalGetNutrExtension.js). fecha_eval se
// maneja aparte por su default en DB.
//
// Antropometría de la evaluación + inputs de la fórmula rápida; y las cantidades
// de EQ, tomadas de GRUPOS_EQUIVALENTES (fuente única) para no re-listarlas.
const CAMPOS_GET = [
  'peso',
  'estatura',
  'kcal_kg',
  'proteina_g_kg',
  'hc_porcentaje',
  'lipidos_porcentaje',
]

const CAMPOS_GUARDADOS = [...CAMPOS_GET, ...GRUPOS_EQUIVALENTES]

function pickCampos(data) {
  return Object.fromEntries(
    CAMPOS_GUARDADOS.filter((c) => data[c] !== undefined).map((c) => [c, data[c]])
  )
}

function formatCalGetNutr(n, paciente_id) {
  if (!n) return null
  return {
    ...n,
    id: toUUID(n.id),
    historia_paciente_id: toUUID(n.historia_paciente_id),
    fecha_eval: toDateOnly(n.fecha_eval),
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
    const where = { historias_pacientes_nutricion: { deleted_at: null } }
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const [registros, total] = await prisma.$transaction([
      prisma.cal_get_nutr.findMany({
        where,
        ...buildListArgs({ page, limit, orderBy: [{ fecha_eval: 'desc' }, { id: 'desc' }] }),
      }),
      prisma.cal_get_nutr.count({ where }),
    ])

    return { registros: registros.map((r) => formatCalGetNutr(r)), count: total }
  }

  static async getById(id, tx = prisma) {
    const registro = await tx.cal_get_nutr.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!registro) throw new NotFoundError('el cálculo de GET nutricional')
    return formatCalGetNutr(registro)
  }

  static async create(data, tx = prisma) {
    await assertActiveNutritionHistory(data.historia_paciente_id, tx)
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
    const existing = await tx.cal_get_nutr.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('el cálculo de GET nutricional')

    const paciente_id = await getPacienteId(toUUID(existing.historia_paciente_id), tx)
    await tx.cal_get_nutr.delete({ where: { id: uuidToBuffer(id) } })

    return formatCalGetNutr(existing, paciente_id)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.cal_get_nutr.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('el cálculo de GET nutricional')

    await tx.cal_get_nutr.update({
      where: { id: uuidToBuffer(id) },
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
