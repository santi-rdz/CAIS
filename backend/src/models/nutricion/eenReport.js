import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'
import { NotFoundError, ValidationError } from '#lib/appError.js'

const EDAD_ADULTO = 18

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
 * Resuelve paciente + edad a partir de la historia. Se usa solo en create()
 * para decidir kid vs adulto.
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

async function getPacienteIdFromHistoria(historiaPacienteId, tx) {
  const historia = await tx.historias_pacientes_nutricion.findUnique({
    where: { id: uuidToBuffer(historiaPacienteId) },
    select: { paciente_id: true },
  })
  if (!historia) throw new NotFoundError('la historia del paciente')
  return toUUID(historia.paciente_id)
}

function formatKid(n, paciente_id) {
  if (!n) return null
  return {
    ...n,
    id: toUUID(n.id),
    historia_paciente_id: toUUID(n.historia_paciente_id),
    tipo: 'kid',
    ...(paciente_id ? { paciente_id } : {}),
  }
}

function formatAdulto(n, paciente_id) {
  if (!n) return null
  const { diagnostico_nutricional_adulto, ...rest } = n
  return {
    ...rest,
    id: toUUID(n.id),
    historia_paciente_id: toUUID(n.historia_paciente_id),
    tipo: 'adulto',
    diagnosticos: diagnostico_nutricional_adulto ?? [],
    ...(paciente_id ? { paciente_id } : {}),
  }
}

export class ReporteEenModel {
  static async getAll({ historia_paciente_id, page, limit } = {}) {
    const where = {}
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const [kids, adultos] = await Promise.all([
      prisma.reporte_een_kids_nutricion.findMany({
        where,
        orderBy: [{ fecha_eval: 'desc' }, { id: 'desc' }],
      }),
      prisma.reporte_een_adulto_nutricion.findMany({
        where,
        include: { diagnostico_nutricional_adulto: true },
        orderBy: [{ fecha_eval: 'desc' }, { id: 'desc' }],
      }),
    ])

    const reportes = [...kids.map((k) => formatKid(k)), ...adultos.map((a) => formatAdulto(a))]

    reportes.sort((a, b) => new Date(b.fecha_eval ?? 0) - new Date(a.fecha_eval ?? 0))

    const offset = (page - 1) * limit
    const paginados = reportes.slice(offset, offset + limit)

    return { reportes: paginados, count: reportes.length }
  }

  static async getById(id, tx = prisma) {
    const buffer = uuidToBuffer(id)

    const kid = await tx.reporte_een_kids_nutricion.findUnique({ where: { id: buffer } })
    if (kid) return formatKid(kid)

    const adulto = await tx.reporte_een_adulto_nutricion.findUnique({
      where: { id: buffer },
      include: { diagnostico_nutricional_adulto: true },
    })
    if (adulto) return formatAdulto(adulto)

    throw new NotFoundError('el reporte EEN')
  }

  static async create(data, tx = prisma) {
    const { paciente_id, edad } = await getPatientContext(data.historia_paciente_id, tx)
    const esAdulto = edad !== null && edad >= EDAD_ADULTO

    if (esAdulto && !data.adulto) {
      throw new ValidationError(
        'El paciente es mayor de edad; se requieren los datos del reporte de adulto'
      )
    }
    if (!esAdulto && !data.kid) {
      throw new ValidationError(
        'El paciente es menor de edad; se requieren los datos del reporte pediátrico'
      )
    }

    const reporteId = randomUUID()

    if (esAdulto) {
      const { diagnosticos, ...adultoData } = data.adulto
      const created = await tx.reporte_een_adulto_nutricion.create({
        data: {
          id: uuidToBuffer(reporteId),
          historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
          fecha_eval: data.fecha_eval,
          ...adultoData,
          ...(diagnosticos?.length && {
            diagnostico_nutricional_adulto: { create: diagnosticos },
          }),
        },
        include: { diagnostico_nutricional_adulto: true },
      })
      return formatAdulto(created, paciente_id)
    }

    const created = await tx.reporte_een_kids_nutricion.create({
      data: {
        id: uuidToBuffer(reporteId),
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        fecha_eval: data.fecha_eval,
        ...data.kid,
      },
    })
    return formatKid(created, paciente_id)
  }

  static async delete(id, tx = prisma) {
    const buffer = uuidToBuffer(id)

    const kid = await tx.reporte_een_kids_nutricion.findUnique({ where: { id: buffer } })
    if (kid) {
      const paciente_id = await getPacienteIdFromHistoria(toUUID(kid.historia_paciente_id), tx)
      await tx.reporte_een_kids_nutricion.delete({ where: { id: buffer } })
      return formatKid(kid, paciente_id)
    }

    const adulto = await tx.reporte_een_adulto_nutricion.findUnique({
      where: { id: buffer },
      include: { diagnostico_nutricional_adulto: true },
    })
    if (adulto) {
      const paciente_id = await getPacienteIdFromHistoria(toUUID(adulto.historia_paciente_id), tx)
      await tx.reporte_een_adulto_nutricion.delete({ where: { id: buffer } })
      return formatAdulto(adulto, paciente_id)
    }

    throw new NotFoundError('el reporte EEN')
  }

  static async update(id, data, tx = prisma) {
    const buffer = uuidToBuffer(id)

    const kid = await tx.reporte_een_kids_nutricion.findUnique({ where: { id: buffer } })
    if (kid) {
      const paciente_id = await getPacienteIdFromHistoria(toUUID(kid.historia_paciente_id), tx)
      await tx.reporte_een_kids_nutricion.update({
        where: { id: buffer },
        data: {
          ...(data.fecha_eval !== undefined && { fecha_eval: data.fecha_eval }),
          ...(data.kid ?? {}),
        },
      })
      const updated = await tx.reporte_een_kids_nutricion.findUnique({ where: { id: buffer } })
      return formatKid(updated, paciente_id)
    }

    const adulto = await tx.reporte_een_adulto_nutricion.findUnique({ where: { id: buffer } })
    if (adulto) {
      const paciente_id = await getPacienteIdFromHistoria(toUUID(adulto.historia_paciente_id), tx)
      const { diagnosticos, ...adultoData } = data.adulto ?? {}

      await tx.reporte_een_adulto_nutricion.update({
        where: { id: buffer },
        data: {
          ...(data.fecha_eval !== undefined && { fecha_eval: data.fecha_eval }),
          ...adultoData,
        },
      })

      if (diagnosticos !== undefined) {
        await tx.diagnostico_nutricional_adulto.deleteMany({ where: { reporte_een_id: buffer } })
        if (diagnosticos.length > 0) {
          await tx.diagnostico_nutricional_adulto.createMany({
            data: diagnosticos.map((d) => ({ ...d, reporte_een_id: buffer })),
          })
        }
      }

      const updated = await tx.reporte_een_adulto_nutricion.findUnique({
        where: { id: buffer },
        include: { diagnostico_nutricional_adulto: true },
      })
      return formatAdulto(updated, paciente_id)
    }

    throw new NotFoundError('el reporte EEN')
  }
}
