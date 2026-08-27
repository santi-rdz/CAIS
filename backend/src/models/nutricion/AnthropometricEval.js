import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { assertActiveNutritionHistory } from '#lib/historyGuard.js'
import { toDateOnly } from '#lib/dates.js'
import { buildListArgs } from '#lib/queryFeatures.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'
import { NotFoundError, ValidationError } from '#lib/appError.js'
import { EDAD_ADULTO } from '@cais/shared/constants/patients'

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
    fecha: toDateOnly(n.fecha),
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
    const where = { historias_pacientes_nutricion: { deleted_at: null } }
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const [evals, total] = await prisma.$transaction([
      prisma.eval_antro_ad_nutricion.findMany({
        where,
        include: includeRelations,
        ...buildListArgs({ page, limit, orderBy: [{ fecha: 'desc' }, { id: 'desc' }] }),
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
    await assertActiveNutritionHistory(data.historia_paciente_id, tx)
    const { historia_paciente_id, adulto, kid, ...rest } = data
    const { paciente_id, edad } = await getPatientContext(historia_paciente_id, tx)
    const esAdulto = edad !== null && edad >= EDAD_ADULTO

    if (esAdulto && !adulto) {
      throw new ValidationError(
        'El paciente es mayor de edad; se requieren los datos de evaluación de adulto'
      )
    }
    if (!esAdulto && !kid) {
      throw new ValidationError(
        'El paciente es menor de edad; se requieren los datos de evaluación pediátrica'
      )
    }

    const created = await tx.eval_antro_ad_nutricion.create({
      data: {
        ...rest,
        id: uuidToBuffer(randomUUID()),
        historia_paciente_id: uuidToBuffer(historia_paciente_id),
        ...(esAdulto
          ? { eval_antro_ad_adulto_nutricion: { create: adulto } }
          : { eval_antro_ad_kid_nutricion: { create: kid } }),
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

    // historia_paciente_id no se actualiza (se descarta del spread).
    const { historia_paciente_id, adulto, kid, ...rest } = data

    await tx.eval_antro_ad_nutricion.update({
      where: { id: uuidToBuffer(id) },
      data: {
        ...rest,
        ...(esAdulto && adulto && { eval_antro_ad_adulto_nutricion: { update: adulto } }),
        ...(esKid && kid && { eval_antro_ad_kid_nutricion: { update: kid } }),
      },
    })

    const { paciente_id } = await getPatientContext(toUUID(existing.historia_paciente_id), tx)
    const updated = await this.getById(id, tx)
    return { ...updated, paciente_id }
  }
}
