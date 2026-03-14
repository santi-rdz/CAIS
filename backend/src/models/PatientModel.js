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
  return {
    id: bufferToUUID(u.id),
    doctor_id: bufferToUUID(u?.doctor_id),
    nombre: u?.nombre,
    fecha_nacimiento: u?.fecha_nacimiento,
    actualizado_at: u?.actualizado_at,
    es_externo: u?.es_externo,
    correo: u?.correo,
    telefono: u?.telefono,
    genero: u?.genero,
    domicilio: u?.domicilio,
    ocupacion: u?.ocupacion,
    estado_civil: u?.estado_civil,
    nivel_educativo: u?.nivel_educativo,
    religion: u?.religion,
    nss: u?.nss,
    contacto_emergencia: u?.contacto_emergencia,
    telefono_emergencia: u?.telefono_emergencia,
    parentesco_emergencia: u?.parentesco_emergencia,
    creado_at: u?.creado_at,
  }
}

export class PatientModel {
  static async getAll({ sortBy, search, page, limit, genre }) {
    const where = {}

    if (search) {
      where.OR = [{ nombre: { contains: search } }]
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
      await prisma.pacientes.update({
        where: { id: uuidToBuffer(id) },
        data,
      })
      return await this.getById(id)
    } catch (err) {
      if (err.code === 'P2025') return null
      console.error('Error en PatientModel.update:', err)
      throw err
    }
  }

  static async create(data, userId, tx = prisma) {
    const patientId = randomUUID()

    await tx.pacientes.create({
      data: {
        id: uuidToBuffer(patientId),
        doctor_id: uuidToBuffer(userId),
        nombre: data.nombre,
        fecha_nacimiento: data.fecha_nacimiento,
        es_externo: data.es_externo || false,
        correo: data.correo || null,
        telefono: data.telefono || null,
        genero: data.genero || null,
        domicilio: data.domicilio || null,
        ocupacion: data.ocupacion || null,
        estado_civil: data.estado_civil || null,
        nivel_educativo: data.nivel_educativo || null,
        religion: data.religion || null,
        nss: data.nss || null,
        contacto_emergencia: data.contacto_emergencia || null,
        telefono_emergencia: data.telefono_emergencia || null,
        parentesco_emergencia: data.parentesco_emergencia || null,
      },
      include: includeRelations,
    })

    return this.getById(patientId, tx)
  }
}
