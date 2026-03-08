import { randomUUID } from 'node:crypto'
import { prisma } from '../config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '../lib/uuid.js'

const includeRelations = {
  usuarios: true
}

function formatEmergency(u) {
  if (!u) return null
  return {
    id: bufferToUUID(u.id),
    usuario_id: bufferToUUID(u?.usuario_id),
    fecha_hora: u?.fecha_hora,
    ubicacion: u?.ubicacion,
    nombre: u?.nombre,
    matricula: u?.matricula,
    telefono: u?.telefono,
    diagnostico: u?.diagnostico,
    accion_realizada: u?.accion_realizada,
    tratamiento_admin: u?.tratamiento_admin,
    recurrente: u?.recurrente,
  }
}

export class EmergencyModel {
  static async getAll({ sortBy, search, page, limit }) {
    const where = {}
    
    if (search) {
      where.OR = [
        { nombre: { contains: search } }
      ]
    }

    const sortOptions = {
      'nombre-asc': { nombre: 'asc' },
      'nombre-desc': { nombre: 'desc' },
      'date-asc': { fecha_hora: 'asc' },
      'date-desc': { fecha_hora: 'desc' },
    }

    const orderBy =
      sortBy && sortOptions[sortBy]
        ? sortOptions[sortBy]
        : { fecha_hora: 'desc' }

    const offset = (page - 1) * limit

    const [emergencies, total] = await prisma.$transaction([
      prisma.bitacora_emergencias.findMany({
        where,
        include: includeRelations,
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.bitacora_emergencias.count({ where }),
    ])

    return { emergencies: emergencies.map(formatEmergency), count: total }
  }

  static async getById(id, tx = prisma) {
      const emergency = await tx.bitacora_emergencias.findUnique({
        where: { id: uuidToBuffer(id) },
        include: includeRelations,
      })
      return formatEmergency(emergency)
    }

  static async create(data, userId, tx = prisma) {
    const emergencyId = randomUUID()

    const emergency = await tx.bitacora_emergencias.create({
      data: {
        id: uuidToBuffer(emergencyId),
        usuario_id: uuidToBuffer(userId),
        ubicacion: data.ubicacion,
        nombre: data.nombre || null,
        matricula: data.matricula || null,
        telefono: data.telefono || null,
        diagnostico: data.diagnostico,
        accion_realizada: data.accion_realizada,
        tratamiento_admin: data.tratamiento_admin || null,
        recurrente: data.recurrente || false,
      },
      include: includeRelations,
    })

    await this.getById(emergencyId, tx)
  }
}