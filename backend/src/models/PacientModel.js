import { randomUUID } from 'node:crypto'
import { prisma } from '../config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '../lib/uuid.js'

const includeRelations = {
  usuarios: true,
}

function formatPacient(u) {
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

export class PacientModel {
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

    const parsedPage = Number(page)
    const parsedLimit = Number(limit)
    const safePage =
      Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10
    const offset = (safePage - 1) * safeLimit

    const [pacients, total] = await prisma.$transaction([
      prisma.pacientes.findMany({
        where,
        include: includeRelations,
        orderBy,
        skip: offset,
        take: safeLimit,
      }),
      prisma.pacientes.count({ where }),
    ])

    return { pacients: pacients.map(formatPacient), count: total }
  }

  static async getById(id, tx = prisma) {
    const pacient = await tx.pacientes.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatPacient(pacient)
  }

  static async create(data, userId, tx = prisma) {
    const pacientId = randomUUID()

    await tx.pacientes.create({
      data: {
        id: uuidToBuffer(pacientId),
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

    return this.getById(pacientId, tx)
  }
}
