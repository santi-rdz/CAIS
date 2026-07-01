import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { formatDefs } from '#lib/formatDef.js'
import { PATIENT_SORT_DEFS } from '@cais/shared/constants/patients'
import { NotFoundError } from '#lib/appError.js'

const includeRelations = {
  usuarios: true,
}

const SORT_OPTIONS = formatDefs(PATIENT_SORT_DEFS)

function formatPatient(u) {
  if (!u) return null
  const { usuarios, ...rest } = u
  return {
    ...rest,
    id: bufferToUUID(u.id),
    doctor_id: bufferToUUID(u.doctor_id),
    doctor_area_id: usuarios?.area_id ?? null,
  }
}

export class PatientModel {
  static async getAll({ sortBy, search, page, limit, genre, areaId }) {
    const where = {}

    if (areaId != null) {
      where.usuarios = { area_id: areaId }
    }

    if (search) {
      const tokens = search.trim().split(/\s+/).filter(Boolean)
      where.AND = tokens.map((token) => ({
        OR: [
          { nombre: { contains: token } },
          { apellidos: { contains: token } },
          { telefono: { contains: token } },
        ],
      }))
    }

    const orderBy = sortBy && SORT_OPTIONS[sortBy] ? SORT_OPTIONS[sortBy] : { creado_at: 'desc' }

    if (genre) {
      where.genero = genre
    }
    const offset = (page - 1) * limit

    const [patients, total] = await prisma.$transaction([
      prisma.pacientes.findMany({
        where,
        include: includeRelations,
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.pacientes.count({ where }),
    ])

    return { patients: patients.map(formatPatient), count: total }
  }

  static async getById(id, tx = prisma) {
    const patient = await tx.pacientes.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!patient) throw new NotFoundError('el paciente')
    return formatPatient(patient)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.pacientes.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('el paciente')
    await tx.pacientes.delete({ where: { id: uuidToBuffer(id) } })
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.pacientes.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('el paciente')

    await tx.pacientes.update({
      where: { id: uuidToBuffer(id) },
      data: { ...data, actualizado_at: new Date() },
    })
    return this.getById(id, tx)
  }

  static async touch(id, tx = prisma) {
    await tx.pacientes.update({
      where: { id: uuidToBuffer(id) },
      data: { actualizado_at: new Date() },
    })
  }

  static async create(data, userId, tx = prisma) {
    const patientId = randomUUID()

    await tx.pacientes.create({
      data: {
        ...data,
        id: uuidToBuffer(patientId),
        doctor_id: uuidToBuffer(userId),
      },
      include: includeRelations,
    })

    return this.getById(patientId, tx)
  }
}
