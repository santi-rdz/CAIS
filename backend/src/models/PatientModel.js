import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'

const includeRelations = {
  usuarios: true,
}

function formatPatient(u) {
  if (!u) return null
  return {
    id: bufferToUUID(u.id),
    doctor_id: bufferToUUID(u?.doctor_id),
    nombre: u?.nombre,
    fecha_nacimiento: u?.fecha_nacimiento,
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
  static async getAll({ sortBy, search, page, limit }) {
    const where = {}

    if (search) {
      where.OR = [{ nombre: { contains: search } }]
    }

    const sortOptions = {
      'nombre-asc': { nombre: 'asc' },
      'nombre-desc': { nombre: 'desc' },
      'date-asc': { creado_at: 'asc' },
      'date-desc': { creado_at: 'desc' },
    }

    const orderBy =
      sortBy && sortOptions[sortBy]
        ? sortOptions[sortBy]
        : { creado_at: 'desc' }

    const MAX_PAGE_SIZE = 100
    const parsedPage = Number(page)
    const parsedLimit = Number(limit)
    const safePage =
      Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, MAX_PAGE_SIZE)
        : 10
    const offset = (safePage - 1) * safeLimit

    const [patients, total] = await prisma.$transaction([
      prisma.pacientes.findMany({
        where,
        include: includeRelations,
        orderBy,
        skip: offset,
        take: safeLimit,
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
    const fieldMap = {
      doctor_id: 'doctor_id',
      nombre: 'nombre',
      fecha_nacimiento: 'fecha_nacimiento',
      es_externo: 'es_externo',
      correo: 'correo',
      telefono: 'telefono',
      genero: 'genero',
      domicilio: 'domicilio',
      ocupacion: 'ocupacion',
      estado_civil: 'estado_civil',
      nivel_educativo: 'nivel_educativo',
      religion: 'religion',
      nss: 'nss',
      contacto_emergencia: 'contacto_emergencia',
      telefono_emergencia: 'telefono_emergencia',
      parentesco_emergencia: 'parentesco_emergencia',
    }

    const prismaData = Object.fromEntries(
      Object.entries(data)
        .filter(([k]) => fieldMap[k])
        .map(([k, v]) => [fieldMap[k], v])
    )

    try {
      await prisma.pacientes.update({
        where: { id: uuidToBuffer(id) },
        data: prismaData,
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
