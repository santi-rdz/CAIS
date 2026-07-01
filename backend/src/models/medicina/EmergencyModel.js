import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { formatDefs } from '#lib/formatDef.js'
import { EMERGENCY_SORT_DEFS } from '@cais/shared/constants/emergencies'
import { NotFoundError } from '#lib/appError.js'

const includeRelations = {
  usuarios: true,
}

const SORT_OPTIONS = formatDefs(EMERGENCY_SORT_DEFS)

function formatEmergency(u) {
  if (!u) return null
  const { usuarios, ...rest } = u
  return {
    ...rest,
    id: bufferToUUID(u.id),
    usuario_id: bufferToUUID(u.usuario_id),
    registrado_por: usuarios
      ? { nombre: usuarios.nombre, apellidos: usuarios.apellidos, correo: usuarios.correo }
      : null,
  }
}

export class EmergencyModel {
  static async getAll({ sortBy, search, page, limit, recurrentBoolean: recurrent }) {
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

    const orderBy = sortBy && SORT_OPTIONS[sortBy] ? SORT_OPTIONS[sortBy] : { fecha_hora: 'desc' }

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
    if (!emergency) throw new NotFoundError('la emergencia')
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

  static async delete(id, tx = prisma) {
    const existing = await tx.bitacora_emergencias.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la emergencia')
    await tx.bitacora_emergencias.delete({ where: { id: uuidToBuffer(id) } })
    return formatEmergency(existing)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.bitacora_emergencias.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('la emergencia')

    await tx.bitacora_emergencias.update({ where: { id: uuidToBuffer(id) }, data })
    return this.getById(id, tx)
  }
}
