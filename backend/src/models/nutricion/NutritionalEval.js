import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID, nestedCreate, nestedUpsert, buildNestedRelations } from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'

// La evaluación enlaza a la historia; el paciente_id se resuelve desde la
// historia para auditar y tocar el registro del paciente en el controlador.
const includeRelations = {
  historias_pacientes_nutricion: { select: { paciente_id: true } },
  eval_apetito_nutricion: true,
  frec_consumo_alimentos_nutricion: true,
  horarios_comida_nutricion: true,
}

const selectBasic = {
  id: true,
  historia_paciente_id: true,
  fecha: true,
  creado_at: true,
}

const NESTED_RELATIONS = [
  'eval_apetito_nutricion',
  'frec_consumo_alimentos_nutricion',
  'horarios_comida_nutricion',
]

function formatEvalNutr(n) {
  if (!n) return null
  const { historias_pacientes_nutricion, ...rest } = n
  return {
    ...rest,
    id: toUUID(n.id),
    historia_paciente_id: toUUID(n.historia_paciente_id),
    paciente_id: toUUID(historias_pacientes_nutricion?.paciente_id),
  }
}

function formatMinimal(n) {
  const result = { ...n, id: toUUID(n.id) }
  if ('historia_paciente_id' in n) result.historia_paciente_id = toUUID(n.historia_paciente_id)
  return result
}

export class NutritionalEvalModel {
  static async getAll({ historia_paciente_id, page = 1, limit = 20, fields } = {}) {
    const where = {}
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const offset = (page - 1) * limit

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [evals, total] = await prisma.$transaction([
      prisma.eval_nutr_fh.findMany({
        where,
        ...queryOptions,
        orderBy: [{ creado_at: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.eval_nutr_fh.count({ where }),
    ])

    return { evals: evals.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const evalNutr = await tx.eval_nutr_fh.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!evalNutr) throw new NotFoundError('la evaluación nutricional')
    return formatEvalNutr(evalNutr)
  }

  static async create(data, tx = prisma) {
    const evalId = randomUUID()

    await tx.eval_nutr_fh.create({
      data: {
        id: uuidToBuffer(evalId),
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        fecha: data.fecha,
        sigue_dieta: data.sigue_dieta,
        tiene_alergia: data.tiene_alergia,
        cual_alergia: data.cual_alergia,
        alimentos_disgusta: data.alimentos_disgusta,
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedCreate),
      },
    })

    return this.getById(evalId, tx)
  }

  static async delete(id) {
    const existing = await prisma.eval_nutr_fh.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la evaluación nutricional')
    await prisma.eval_nutr_fh.delete({ where: { id: uuidToBuffer(id) } })
    return formatEvalNutr(existing)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.eval_nutr_fh.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('la evaluación nutricional')

    await tx.eval_nutr_fh.update({
      where: { id: uuidToBuffer(id) },
      data: {
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        sigue_dieta: data.sigue_dieta,
        tiene_alergia: data.tiene_alergia,
        cual_alergia: data.cual_alergia,
        alimentos_disgusta: data.alimentos_disgusta,
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedUpsert),
      },
    })
    return this.getById(id, tx)
  }
}
