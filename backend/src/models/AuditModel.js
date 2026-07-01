import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { validateAuditCreate } from '@cais/shared/schemas/audit'
import { parsePagination } from '#lib/paginate.js'
import { NotFoundError } from '#lib/appError.js'

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
    paciente_id: u.paciente_id ? bufferToUUID(u.paciente_id) : null,
    accion: acciones?.codigo ?? null,
    entidad: entidades?.nombre ?? null,
    usuario: usuarios?.nombre ?? null,
  }
}

export class AuditModel {
  static async getAll({ usuario_id, accion, entidad, paciente_id, page, limit } = {}) {
    const { page: safePage, limit: safeLimit } = parsePagination({ page, limit })

    const where = {}

    if (usuario_id) {
      where.usuario_id = uuidToBuffer(usuario_id)
    }

    if (accion) {
      where.acciones = { codigo: accion.toUpperCase() }
    }

    if (entidad) {
      const entidades = String(entidad)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)

      if (entidades.length > 0) {
        where.entidades = { nombre: { in: entidades } }
      }
    }

    if (paciente_id) {
      where.paciente_id = uuidToBuffer(paciente_id)
    }

    const offset = (safePage - 1) * safeLimit

    const [records, total] = await prisma.$transaction([
      prisma.registro_auditoria.findMany({
        where,
        include: includeRelations,
        orderBy: { fecha_hora: 'desc' },
        skip: offset,
        take: safeLimit,
      }),
      prisma.registro_auditoria.count({ where }),
    ])

    return { records: records.map(formatAudit), count: total }
  }

  static async create(
    { usuario_id, accion, entidad, objetivo_id = null, paciente_id = null },
    tx = prisma
  ) {
    const validation = validateAuditCreate({
      usuario_id,
      accion,
      entidad,
      objetivo_id,
      paciente_id,
    })
    if (!validation.success)
      throw new Error(validation.error.issues.map((i) => i.message).join(', '))

    const record = await tx.registro_auditoria.create({
      data: {
        usuarios: { connect: { id: uuidToBuffer(usuario_id) } },
        acciones: { connect: { codigo: accion.toUpperCase() } },
        entidades: { connect: { nombre: entidad } },
        objetivo_id: objetivo_id ? uuidToBuffer(objetivo_id) : null,
        ...(paciente_id && { pacientes: { connect: { id: uuidToBuffer(paciente_id) } } }),
      },
      include: includeRelations,
    })

    return formatAudit(record)
  }
  static async getById(id) {
    const record = await prisma.registro_auditoria.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!record) throw new NotFoundError('el registro de auditoría')
    return formatAudit(record)
  }
}
