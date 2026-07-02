import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID, nestedCreate, nestedUpsert, buildNestedRelations } from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'

// La evaluación enlaza a la historia; el paciente_id se resuelve desde la
// historia para auditar y tocar el registro del paciente en el controlador.
const includeRelations = {
  historias_pacientes_nutricion: { select: { paciente_id: true } },
  perfil_anemia_nutricion: true,
  perfil_endocrino: true,
  perfil_renal_electrolitos: true,
  perfil_lipidos: true,
  balance_acido_base: true,
  perfil_orina: true,
  perfil_inflamatorio: true,
  eval_estado_nutricion: true,
}

const selectBasic = {
  id: true,
  historia_paciente_id: true,
  creado_at: true,
}

const NESTED_RELATIONS = [
  'perfil_anemia_nutricion',
  'perfil_endocrino',
  'perfil_renal_electrolitos',
  'perfil_lipidos',
  'balance_acido_base',
  'perfil_orina',
  'perfil_inflamatorio',
  'eval_estado_nutricion',
]

const ALLOWED_FIELDS = new Set(['id', 'historia_paciente_id', 'fecha', 'creado_at'])

function formatNested(obj) {
  if (!obj) return null
  const { id_eval_bioq, ...rest } = obj
  return rest
}

function formatBiochemicalEval(n) {
  if (!n) return null
  return {
    id: toUUID(n.id),
    historia_paciente_id: toUUID(n.historia_paciente_id),
    paciente_id: toUUID(n.historias_pacientes_nutricion?.paciente_id),
    fecha: n.fecha,
    creado_at: n.creado_at,
    perfil_anemia_nutricion: formatNested(n.perfil_anemia_nutricion),
    perfil_endocrino: formatNested(n.perfil_endocrino),
    perfil_renal_electrolitos: formatNested(n.perfil_renal_electrolitos),
    perfil_lipidos: formatNested(n.perfil_lipidos),
    balance_acido_base: formatNested(n.balance_acido_base),
    perfil_orina: formatNested(n.perfil_orina),
    perfil_inflamatorio: formatNested(n.perfil_inflamatorio),
    eval_estado_nutricion: formatNested(n.eval_estado_nutricion),
  }
}

function formatMinimal(n) {
  const result = { ...n, id: toUUID(n.id) }
  if ('historia_paciente_id' in n) result.historia_paciente_id = toUUID(n.historia_paciente_id)
  return result
}

export class BiochemicalEvalModel {
  static async getAll({ historia_paciente_id, page, limit, fields } = {}) {
    const where = {}
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const offset = (page - 1) * limit

    const invalidFields = fields?.filter((f) => !ALLOWED_FIELDS.has(f))
    if (invalidFields?.length) {
      return { evaluations: [], count: 0 }
    }

    const queryOptions = {
      select: fields
        ? {
            id: true,
            ...Object.fromEntries(
              fields.filter((f) => ALLOWED_FIELDS.has(f)).map((f) => [f, true])
            ),
          }
        : selectBasic,
    }

    const [evaluations, total] = await prisma.$transaction([
      prisma.eval_bioq_nutricion.findMany({
        where,
        ...queryOptions,
        orderBy: [{ creado_at: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.eval_bioq_nutricion.count({ where }),
    ])

    return { evaluations: evaluations.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const evaluation = await tx.eval_bioq_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!evaluation) throw new NotFoundError('la evaluación bioquímica')
    return formatBiochemicalEval(evaluation)
  }

  static async create(data, tx = prisma) {
    const evaluationId = randomUUID()

    await tx.eval_bioq_nutricion.create({
      data: {
        id: uuidToBuffer(evaluationId),
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedCreate),
      },
    })

    return this.getById(evaluationId, tx)
  }

  static async delete(id) {
    const existing = await prisma.eval_bioq_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la evaluación bioquímica')
    await prisma.eval_bioq_nutricion.delete({ where: { id: uuidToBuffer(id) } })
    return formatBiochemicalEval(existing)
  }

  static async update(id, data, tx = prisma) {
    const evalBuffer = uuidToBuffer(id)

    const exists = await tx.eval_bioq_nutricion.findUnique({ where: { id: evalBuffer } })
    if (!exists) throw new NotFoundError('la evaluación bioquímica')

    await tx.eval_bioq_nutricion.update({
      where: { id: evalBuffer },
      data: {
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedUpsert),
      },
    })

    return this.getById(id, tx)
  }
}
