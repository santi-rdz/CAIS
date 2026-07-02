import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import {
  toUUID,
  nestedCreate,
  nestedUpsert,
  planesEstudioCreate,
  planesEstudioUpsert,
  buildNestedRelations,
} from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'

const includeRelations = {
  usuarios: { select: { nombre: true, foto: true } },
  historias_medicas: { select: { paciente_id: true } },
  aparatos_sistemas: true,
  informacion_fisica: true,
  planes_estudio: { include: { planes_estudio_cie10: true } },
}

const listSelect = {
  id: true,
  creado_at: true,
  motivo_consulta: true,
  usuarios: { select: { nombre: true, foto: true } },
  planes_estudio: {
    select: {
      planes_estudio_cie10: { select: { codigo: true, descripcion: true } },
    },
  },
}

const NESTED_RELATIONS = ['aparatos_sistemas', 'informacion_fisica']

function formatEvolutionNote(n) {
  if (!n) return null
  const { planes_estudio, historias_medicas, ...rest } = n
  const plan = Array.isArray(planes_estudio)
    ? (planes_estudio[0] ?? null)
    : (planes_estudio ?? null)
  return {
    ...rest,
    id: toUUID(n.id),
    paciente_id: toUUID(historias_medicas?.paciente_id),
    historia_medica_id: toUUID(n.historia_medica_id),
    usuario_id: n.usuario_id ? toUUID(n.usuario_id) : null,

    planes_estudio: plan
      ? {
          ...plan,
          nota_evolucion_id: undefined,
          cie10_codes:
            plan.planes_estudio_cie10?.map(({ codigo, descripcion }) => ({
              codigo,
              descripcion,
            })) ?? [],
          planes_estudio_cie10: undefined,
        }
      : null,
  }
}

function formatListNote(n) {
  const plan = Array.isArray(n.planes_estudio)
    ? (n.planes_estudio[0] ?? null)
    : (n.planes_estudio ?? null)
  return {
    id: toUUID(n.id),
    creado_at: n.creado_at,
    motivo_consulta: n.motivo_consulta,
    usuarios: n.usuarios,
    planes_estudio: plan
      ? {
          cie10_codes:
            plan.planes_estudio_cie10?.map(({ codigo, descripcion }) => ({
              codigo,
              descripcion,
            })) ?? [],
        }
      : null,
  }
}

export class EvolutionNoteModel {
  static async getAll({ historia_medica_id, page = 1, limit = 10 } = {}) {
    const where = {}
    if (historia_medica_id) where.historia_medica_id = uuidToBuffer(historia_medica_id)

    const offset = (page - 1) * limit

    const [notes, total] = await prisma.$transaction([
      prisma.notas_evolucion.findMany({
        where,
        select: listSelect,
        orderBy: { creado_at: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.notas_evolucion.count({ where }),
    ])

    return { notes: notes.map(formatListNote), count: total }
  }

  static async getById(id, tx = prisma) {
    const note = await tx.notas_evolucion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!note) throw new NotFoundError('la nota de evolución')
    return formatEvolutionNote(note)
  }

  static async create(data, userId, tx = prisma) {
    if (!userId) {
      throw new Error('EvolutionNote.create requires a userId')
    }
    const noteId = randomUUID()

    await tx.notas_evolucion.create({
      data: {
        id: uuidToBuffer(noteId),
        historia_medica_id: uuidToBuffer(data.historia_medica_id),
        usuario_id: uuidToBuffer(userId),
        creado_at: data.creado_at ? new Date(data.creado_at) : undefined,
        motivo_consulta: data.motivo_consulta ?? null,
        ant_gine_andro: data.ant_gine_andro ?? null,
        estudios_complementarios_efectuados: data.estudios_complementarios_efectuados ?? null,
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedCreate),
        ...(data.planes_estudio && {
          planes_estudio: planesEstudioCreate(data.planes_estudio),
        }),
      },
    })

    return this.getById(noteId, tx)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.notas_evolucion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('la nota de evolución')
    await tx.notas_evolucion.delete({ where: { id: uuidToBuffer(id) } })
    return formatEvolutionNote(existing)
  }

  static async update(id, data, userId, tx = prisma) {
    const existing = await tx.notas_evolucion.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('la nota de evolución')

    await tx.notas_evolucion.update({
      where: { id: uuidToBuffer(id) },
      data: {
        ...(data.creado_at != null && {
          creado_at: new Date(data.creado_at),
        }),
        motivo_consulta: data.motivo_consulta,
        ant_gine_andro: data.ant_gine_andro,
        estudios_complementarios_efectuados: data.estudios_complementarios_efectuados,
        ...buildNestedRelations(data, NESTED_RELATIONS, nestedUpsert),
        ...(data.planes_estudio && {
          planes_estudio: planesEstudioUpsert(data.planes_estudio),
        }),
      },
    })
    return this.getById(id, tx)
  }
}
