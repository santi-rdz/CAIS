import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'

const includeRelations = {
  usuarios: true,
  acciones: true,
  entidades: true,
}

function formatAudit(u) {
  if (!u) return null
  const { acciones, entidades, usuarios, ...rest } = u
  return {
    ...rest,
    id: bufferToUUID(u.id),
    usuario_id: bufferToUUID(u.usuario_id),
    objetivo_id: u.objetivo_id ? bufferToUUID(u.objetivo_id) : null,
    accion: acciones?.codigo ?? null,
    entidad: entidades?.nombre ?? null,
    usuario: usuarios?.nombre ?? null,
  }
}

export class AuditModel {
  static async getAll({ usuario_id, accion, entidad, page = 1, limit = 20 } = {}) {
    const where = {}

    if (usuario_id) {
      where.usuario_id = uuidToBuffer(usuario_id)
    }

    if (accion) {
      where.acciones = { codigo: accion.toUpperCase() }
    }

    if (entidad) {
      where.entidades = { nombre: { contains: entidad } }
    }

    const offset = (page - 1) * limit

    const [records, total] = await prisma.$transaction([
      prisma.registro_auditoria.findMany({
        where,
        include: includeRelations,
        orderBy: { fecha_hora: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.registro_auditoria.count({ where }),
    ])

    return { records: records.map(formatAudit), count: total }
  }

  static async getById(id) {
    const record = await prisma.registro_auditoria.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatAudit(record)
  }

  static async create({ usuario_id, accion, entidad, objetivo_id = null }, tx = prisma) {
    const accionRow = await tx.acciones.findFirst({
      where: { codigo: accion.toUpperCase() },
    })
    if (!accionRow) throw new Error(`Acción inválida: ${accion}`)

    const entidadRow = await tx.entidades.findFirst({
      where: { nombre: entidad },
    })
    if (!entidadRow) throw new Error(`Entidad inválida: ${entidad}`)

    const record = await tx.registro_auditoria.create({
      data: {
        usuario_id: uuidToBuffer(usuario_id),
        accion_id: accionRow.id,
        entidad_id: entidadRow.id,
        objetivo_id: objetivo_id ? uuidToBuffer(objetivo_id) : null,
      },
      include: includeRelations,
    })

    return formatAudit(record)
  }
}
