import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { formatDefs } from '#lib/formatDef.js'
import { EMERGENCY_SORT_DEFS } from '@cais/shared/constants/emergencies'

const includeRelations = {
  usuarios: true,
}

const SORT_OPTIONS = formatDefs(EMERGENCY_SORT_DEFS)

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
    registrado_por: u.usuarios
      ? { nombre: u.usuarios.nombre, correo: u.usuarios.correo }
      : null,
  }
}

export class EmergencyModel {
  static async getAll({
    sortBy,
    search,
    page,
    limit,
    recurrentBoolean: recurrent,
  }) {
    const where = {}

    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { ubicacion: { contains: search } },
        { matricula: { contains: search } },
        { telefono: { contains: search } },
        { diagnostico: { contains: search } },
        { accion_realizada: { contains: search } },
      ]
    }

    if (recurrent !== null) {
      where.recurrente = recurrent
    }

    const orderBy =
      sortBy && SORT_OPTIONS[sortBy]
        ? SORT_OPTIONS[sortBy]
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

    await tx.bitacora_emergencias.create({
      data: {
        id: uuidToBuffer(emergencyId),
        usuario_id: uuidToBuffer(userId),
        fecha_hora: data.fecha_hora ? new Date(data.fecha_hora) : new Date(),
        ubicacion: data.ubicacion,
        nombre: data.nombre || null,
        matricula: data.matricula || null,
        telefono: data.telefono || null,
        diagnostico: data.diagnostico || null,
        accion_realizada: data.accion_realizada,
        tratamiento_admin: data.tratamiento_admin || null,
        recurrente: data.recurrente || false,
      },
      include: includeRelations,
    })

    return this.getById(emergencyId, tx)
  }

  static async delete(id) {
    try {
      const emergency = await prisma.bitacora_emergencias.delete({
        where: { id: uuidToBuffer(id) },
        include: includeRelations,
      })
      return formatEmergency(emergency)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data) {
    try {
      await prisma.bitacora_emergencias.update({
        where: { id: uuidToBuffer(id) },
        data,
      })
      return await this.getById(id)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
