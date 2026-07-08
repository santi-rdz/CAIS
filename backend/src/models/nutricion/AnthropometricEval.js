import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'
import { NotFoundError, ValidationError } from '#lib/appError.js'

const EDAD_ADULTO = 18

const includeRelations = {
  eval_antro_ad_kid_nutricion: true,
  eval_antro_ad_adulto_nutricion: true,
}

function formatAnthropometricEval(n, paciente_id) {
  if (!n) return null
  return {
    ...n,
    id: toUUID(n.id),
    historia_paciente_id: toUUID(n.historia_paciente_id),
    ...(paciente_id ? { paciente_id } : {}),
  }
}

function calculateAge(fecha_nacimiento) {
  if (!fecha_nacimiento) return null
  const today = new Date()
  const birth = new Date(fecha_nacimiento)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

/**
 * Resuelve el paciente dueño de una historia de nutrición y su edad actual.
 * Se usa para decidir si la evaluación antropométrica corresponde a la
 * tabla "kid" o "adulto".
 */
async function getPatientContext(historiaPacienteId, tx) {
  const historia = await tx.historias_pacientes_nutricion.findUnique({
    where: { id: uuidToBuffer(historiaPacienteId) },
    include: { pacientes: { select: { id: true, fecha_nacimiento: true } } },
  })
  if (!historia) throw new NotFoundError('la historia del paciente')

  return {
    paciente_id: toUUID(historia.pacientes.id),
    edad: calculateAge(historia.pacientes.fecha_nacimiento),
  }
}

export class AnthropometricEvalModel {
  static async getAll({ historia_paciente_id, page, limit } = {}) {
    const where = {}
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const offset = (page - 1) * limit

    const [evals, total] = await prisma.$transaction([
      prisma.eval_antro_ad_nutricion.findMany({
        where,
        include: includeRelations,
        orderBy: [{ fecha: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.eval_antro_ad_nutricion.count({ where }),
    ])

    return {
      evals: evals.map((e) => formatAnthropometricEval(e)),
      count: total,
    }
  }

  static async getById(id, tx = prisma) {
    const evalAntro = await tx.eval_antro_ad_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!evalAntro) throw new NotFoundError('la evaluación antropométrica')
    return formatAnthropometricEval(evalAntro)
  }

  static async create(data, tx = prisma) {
    const { paciente_id, edad } = await getPatientContext(data.historia_paciente_id, tx)
    const esAdulto = edad !== null && edad >= EDAD_ADULTO

    if (esAdulto && !data.adulto) {
      throw new ValidationError(
        'El paciente es mayor de edad; se requieren los datos de evaluación de adulto'
      )
    }
    if (!esAdulto && !data.kid) {
      throw new ValidationError(
        'El paciente es menor de edad; se requieren los datos de evaluación pediátrica'
      )
    }

    const evalId = randomUUID()

    const created = await tx.eval_antro_ad_nutricion.create({
      data: {
        id: uuidToBuffer(evalId),
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        fecha: data.fecha,
        peso_actual: data.peso_actual,
        estatura: data.estatura,
        imc: data.imc,
        pantorrilla: data.pantorrilla,
        cintura: data.cintura,
        pb: data.pb,
        pct: data.pct,
        pcse: data.pcse,
        ...(esAdulto
          ? { eval_antro_ad_adulto_nutricion: { create: data.adulto } }
          : { eval_antro_ad_kid_nutricion: { create: data.kid } }),
      },
      include: includeRelations,
    })

    return formatAnthropometricEval(created, paciente_id)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.eval_antro_ad_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la evaluación antropométrica')

    const { paciente_id } = await getPatientContext(toUUID(existing.historia_paciente_id), tx)

    await tx.eval_antro_ad_nutricion.delete({ where: { id: uuidToBuffer(id) } })
    return formatAnthropometricEval(existing, paciente_id)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.eval_antro_ad_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la evaluación antropométrica')

    const esAdulto = Boolean(existing.eval_antro_ad_adulto_nutricion)
    const esKid = Boolean(existing.eval_antro_ad_kid_nutricion)

    await tx.eval_antro_ad_nutricion.update({
      where: { id: uuidToBuffer(id) },
      data: {
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        peso_actual: data.peso_actual,
        estatura: data.estatura,
        imc: data.imc,
        pantorrilla: data.pantorrilla,
        cintura: data.cintura,
        pb: data.pb,
        pct: data.pct,
        pcse: data.pcse,
        ...(esAdulto &&
          data.adulto && {
            eval_antro_ad_adulto_nutricion: { update: data.adulto },
          }),
        ...(esKid &&
          data.kid && {
            eval_antro_ad_kid_nutricion: { update: data.kid },
          }),
      },
    })

    const { paciente_id } = await getPatientContext(toUUID(existing.historia_paciente_id), tx)
    const updated = await this.getById(id, tx)
    return { ...updated, paciente_id }
  }
}
