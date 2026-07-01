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

function formatActFisica(a) {
  if (!a) return null
  const { historias_pacientes_nutricion, ...rest } = a
  return {
    ...rest,
    historia_paciente_id: toUUID(a.historia_paciente_id),
    paciente_id: toUUID(historias_pacientes_nutricion?.paciente_id),
  }
}

function formatMinimal(a) {
  const result = { ...a }
  if ('historia_paciente_id' in a) result.historia_paciente_id = toUUID(a.historia_paciente_id)
  return result
}

export class EvalActFisicaModel {
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
      prisma.eval_act_fisica_nutricion.findMany({
        where,
        ...queryOptions,
        orderBy: [{ fecha: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.eval_act_fisica_nutricion.count({ where }),
    ])

    return { evaluaciones: evaluaciones.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const evaluacion = await tx.eval_act_fisica_nutricion.findUnique({
      where: { id: Number(id) },
      include: includeRelations,
    })
    if (!evaluacion) throw new NotFoundError('la evaluación de actividad física')
    return formatActFisica(evaluacion)
  }

  static async create(data, tx = prisma) {
    const evaluacion = await tx.eval_act_fisica_nutricion.create({
      data: {
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        ...(data.tipo !== undefined && { tipo: data.tipo }),
        ...(data.porque_no !== undefined && { porque_no: data.porque_no }),
        ...(data.frecuencia !== undefined && { frecuencia: data.frecuencia }),
        ...(data.duracion !== undefined && { duracion: data.duracion }),
        ...(data.intensidad !== undefined && { intensidad: data.intensidad }),
        ...(data.clasif_tiempo_af !== undefined && { clasif_tiempo_af: data.clasif_tiempo_af }),
        ...(data.tiempo_de_practica !== undefined && {
          tiempo_de_practica: data.tiempo_de_practica,
        }),
        ...(data.pensamientos_con_realizar_AF !== undefined && {
          pensamientos_con_realizar_AF: data.pensamientos_con_realizar_AF,
        }),
      },
    })
    return this.getById(evaluacion.id, tx)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.eval_act_fisica_nutricion.findUnique({
      where: { id: Number(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la evaluación de actividad física')
    await tx.eval_act_fisica_nutricion.delete({ where: { id: Number(id) } })
    return formatActFisica(existing)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.eval_act_fisica_nutricion.findUnique({ where: { id: Number(id) } })
    if (!existing) throw new NotFoundError('la evaluación de actividad física')

    await tx.eval_act_fisica_nutricion.update({
      where: { id: Number(id) },
      data: {
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        ...(data.tipo !== undefined && { tipo: data.tipo }),
        ...(data.porque_no !== undefined && { porque_no: data.porque_no }),
        ...(data.frecuencia !== undefined && { frecuencia: data.frecuencia }),
        ...(data.duracion !== undefined && { duracion: data.duracion }),
        ...(data.intensidad !== undefined && { intensidad: data.intensidad }),
        ...(data.clasif_tiempo_af !== undefined && { clasif_tiempo_af: data.clasif_tiempo_af }),
        ...(data.tiempo_de_practica !== undefined && {
          tiempo_de_practica: data.tiempo_de_practica,
        }),
        ...(data.pensamientos_con_realizar_AF !== undefined && {
          pensamientos_con_realizar_AF: data.pensamientos_con_realizar_AF,
        }),
      },
    })
    return this.getById(id, tx)
  }
}
