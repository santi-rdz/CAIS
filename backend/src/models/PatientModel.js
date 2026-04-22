import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { formatDefs } from '#lib/formatDef.js'
import { PATIENT_SORT_DEFS } from '@cais/shared/constants/patients'

const includeRelations = {
  usuarios: true,
}

const SORT_OPTIONS = formatDefs(PATIENT_SORT_DEFS)

function formatPatient(u) {
  if (!u) return null
  const { usuarios: _usuarios, ...rest } = u
  return {
    ...rest,
    id: bufferToUUID(u.id),
    doctor_id: bufferToUUID(u.doctor_id),
  }
}

export class PatientModel {
  static async getAll({ sortBy, search, page, limit, genre }) {
    const where = {}

    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { apellidos: { contains: search } },
        { telefono: { contains: search } },
      ]
    }

    const orderBy =
      sortBy && SORT_OPTIONS[sortBy]
        ? SORT_OPTIONS[sortBy]
        : { creado_at: 'desc' }

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
    return formatPatient(patient)
  }

  static async delete(id) {
    try {
      await prisma.pacientes.delete({ where: { id: uuidToBuffer(id) } })
      return true
    } catch (err) {
      if (err.code === 'P2025') return false
      console.error('Error en PatientModel.delete:', err)
      throw err
    }
  }

  static async update(id, data) {
    try {
      const updateData = {
        ...data,
        actualizado_at: new Date(),
      }

      await prisma.pacientes.update({
        where: { id: uuidToBuffer(id) },
        data: updateData,
      })
      return await this.getById(id)
    } catch (err) {
      if (err.code === 'P2025') return null
      console.error('Error en PatientModel.update:', err)
      throw err
    }
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
