import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { assertActiveNutritionHistory } from '#lib/historyGuard.js'
import { toDateOnly } from '#lib/dates.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID, manyCreate, manyReplace } from '#lib/prismaHelpers.js'
import { NotFoundError, ValidationError } from '#lib/appError.js'
import { EDAD_ADULTO } from '@cais/shared/constants/patients'

// paciente_id cuelga de la historia, no del reporte; se incluye solo donde el
// controller lo necesita para auditoría (create/update/delete).
const historiaInclude = { historias_pacientes_nutricion: { select: { paciente_id: true } } }
const adultoInclude = { diagnostico_nutricional_adulto: true }

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

// Edad del paciente; solo la usa create() para elegir reporte kid vs adulto.
async function getEdadPaciente(historiaPacienteId, tx) {
  const historia = await tx.historias_pacientes_nutricion.findUnique({
    where: { id: uuidToBuffer(historiaPacienteId) },
    select: { pacientes: { select: { fecha_nacimiento: true } } },
  })
  if (!historia) throw new NotFoundError('la historia del paciente')
  return calculateAge(historia.pacientes.fecha_nacimiento)
}

const pacienteIdFrom = (historia) => (historia ? toUUID(historia.paciente_id) : undefined)

function formatKid(n) {
  if (!n) return null
  const { historias_pacientes_nutricion, ...rest } = n
  const paciente_id = pacienteIdFrom(historias_pacientes_nutricion)
  return {
    ...rest,
    id: toUUID(n.id),
    historia_paciente_id: toUUID(n.historia_paciente_id),
    fecha_eval: toDateOnly(n.fecha_eval),
    tipo: 'kid',
    ...(paciente_id && { paciente_id }),
  }
}

// El reporte_een_id (Buffer, FK interna) no se expone al cliente; el resto del
// diagnóstico ya es plano.
const formatDiagnostico = ({ reporte_een_id, ...rest }) => rest

function formatAdulto(n) {
  if (!n) return null
  const { diagnostico_nutricional_adulto, historias_pacientes_nutricion, ...rest } = n
  const paciente_id = pacienteIdFrom(historias_pacientes_nutricion)
  return {
    ...rest,
    id: toUUID(n.id),
    historia_paciente_id: toUUID(n.historia_paciente_id),
    fecha_eval: toDateOnly(n.fecha_eval),
    tipo: 'adulto',
    diagnosticos: (diagnostico_nutricional_adulto ?? []).map(formatDiagnostico),
    ...(paciente_id && { paciente_id }),
  }
}

export class ReporteEenModel {
  static async getAll({ historia_paciente_id, page, limit } = {}) {
    const where = { historias_pacientes_nutricion: { deleted_at: null } }
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const [kids, adultos] = await Promise.all([
      prisma.reporte_een_kids_nutricion.findMany({
        where,
        orderBy: [{ fecha_eval: 'desc' }, { id: 'desc' }],
      }),
      prisma.reporte_een_adulto_nutricion.findMany({
        where,
        include: adultoInclude,
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

    // El id no revela en qué tabla está el reporte, así que se prueban ambas.
    // En paralelo y seguro: los UUID no colisionan, a lo más una fila coincide.
    const [kid, adulto] = await Promise.all([
      tx.reporte_een_kids_nutricion.findUnique({ where: { id: buffer } }),
      tx.reporte_een_adulto_nutricion.findUnique({ where: { id: buffer }, include: adultoInclude }),
    ])

    if (kid) return formatKid(kid)
    if (adulto) return formatAdulto(adulto)

    throw new NotFoundError('el reporte EEN')
  }

  static async create(data, tx = prisma) {
    await assertActiveNutritionHistory(data.historia_paciente_id, tx)
    const edad = await getEdadPaciente(data.historia_paciente_id, tx)
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
    const base = {
      id: uuidToBuffer(reporteId),
      historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
      fecha_eval: data.fecha_eval,
    }

    if (esAdulto) {
      const { diagnosticos, ...adultoData } = data.adulto
      const created = await tx.reporte_een_adulto_nutricion.create({
        data: {
          ...base,
          ...adultoData,
          ...(diagnosticos?.length && { diagnostico_nutricional_adulto: manyCreate(diagnosticos) }),
        },
        include: { ...adultoInclude, ...historiaInclude },
      })
      return formatAdulto(created)
    }

    const created = await tx.reporte_een_kids_nutricion.create({
      data: { ...base, ...data.kid },
      include: historiaInclude,
    })
    return formatKid(created)
  }

  static async delete(id, tx = prisma) {
    const buffer = uuidToBuffer(id)

    const kid = await tx.reporte_een_kids_nutricion.findUnique({
      where: { id: buffer },
      include: historiaInclude,
    })
    if (kid) {
      await tx.reporte_een_kids_nutricion.delete({ where: { id: buffer } })
      return formatKid(kid)
    }

    const adulto = await tx.reporte_een_adulto_nutricion.findUnique({
      where: { id: buffer },
      include: { ...adultoInclude, ...historiaInclude },
    })
    if (adulto) {
      await tx.reporte_een_adulto_nutricion.delete({ where: { id: buffer } })
      return formatAdulto(adulto)
    }

    throw new NotFoundError('el reporte EEN')
  }

  static async update(id, data, tx = prisma) {
    const buffer = uuidToBuffer(id)

    const kid = await tx.reporte_een_kids_nutricion.findUnique({
      where: { id: buffer },
      select: { id: true },
    })
    if (kid) {
      if (data.adulto) {
        throw new ValidationError(
          "Este reporte es de tipo pediátrico; no se pueden enviar datos de 'adulto'."
        )
      }
      const updated = await tx.reporte_een_kids_nutricion.update({
        where: { id: buffer },
        data: {
          ...(data.fecha_eval !== undefined && { fecha_eval: data.fecha_eval }),
          ...(data.kid ?? {}),
        },
        include: historiaInclude,
      })
      return formatKid(updated)
    }

    const adulto = await tx.reporte_een_adulto_nutricion.findUnique({
      where: { id: buffer },
      select: { id: true },
    })
    if (adulto) {
      if (data.kid) {
        throw new ValidationError(
          "Este reporte es de tipo adulto; no se pueden enviar datos de 'kid'."
        )
      }
      const { diagnosticos, ...adultoData } = data.adulto ?? {}
      const updated = await tx.reporte_een_adulto_nutricion.update({
        where: { id: buffer },
        data: {
          ...(data.fecha_eval !== undefined && { fecha_eval: data.fecha_eval }),
          ...adultoData,
          // Reemplaza la lista completa en una llamada (undefined = conservar, [] = limpiar).
          ...(diagnosticos !== undefined && {
            diagnostico_nutricional_adulto: manyReplace(diagnosticos),
          }),
        },
        include: { ...adultoInclude, ...historiaInclude },
      })
      return formatAdulto(updated)
    }

    throw new NotFoundError('el reporte EEN')
  }
}
