import { prisma } from '#config/prisma.js'
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
    historia_paciente_id: toUUID(s.historia_paciente_id),
    paciente_id: toUUID(historias_pacientes_nutricion?.paciente_id),
  }
}

function formatMinimal(s) {
  const result = { ...s }
  if ('historia_paciente_id' in s) result.historia_paciente_id = toUUID(s.historia_paciente_id)
  return result
}

export class EvalCalSuenoModel {
  static async getAll({ historia_paciente_id, page, limit, fields } = {}) {
    const where = {}
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const offset = (page - 1) * limit

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [evaluaciones, total] = await prisma.$transaction([
      prisma.eval_cal_sueno.findMany({
        where,
        ...queryOptions,
        orderBy: [{ fecha: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.eval_cal_sueno.count({ where }),
    ])

    return { evaluaciones: evaluaciones.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const evaluacion = await tx.eval_cal_sueno.findUnique({
      where: { id: Number(id) },
      include: includeRelations,
    })
    if (!evaluacion) throw new NotFoundError('la evaluación de sueño')
    return formatSueno(evaluacion)
  }

  static async create(data, tx = prisma) {
    const evaluacion = await tx.eval_cal_sueno.create({
      data: {
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        ...(data.horas_sueno !== undefined && { horas_sueno: data.horas_sueno }),
        ...(data.clasif_horas_sueno !== undefined && {
          clasif_horas_sueno: data.clasif_horas_sueno,
        }),
        ...(data.insomnio !== undefined && { insomnio: data.insomnio }),
        ...(data.medicacion !== undefined && { medicacion: data.medicacion }),
      },
    })
    return this.getById(evaluacion.id, tx)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.eval_cal_sueno.findUnique({
      where: { id: Number(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la evaluación de sueño')
    await tx.eval_cal_sueno.delete({ where: { id: Number(id) } })
    return formatSueno(existing)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.eval_cal_sueno.findUnique({ where: { id: Number(id) } })
    if (!existing) throw new NotFoundError('la evaluación de sueño')

    await tx.eval_cal_sueno.update({
      where: { id: Number(id) },
      data: {
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        ...(data.horas_sueno !== undefined && { horas_sueno: data.horas_sueno }),
        ...(data.clasif_horas_sueno !== undefined && {
          clasif_horas_sueno: data.clasif_horas_sueno,
        }),
        ...(data.insomnio !== undefined && { insomnio: data.insomnio }),
        ...(data.medicacion !== undefined && { medicacion: data.medicacion }),
      },
    })
    return this.getById(id, tx)
  }
}
