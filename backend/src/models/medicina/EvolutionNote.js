import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'

const includeRelations = {
  aparatos_sistemas: true,
  informacion_fisica: true,
  planes_estudio: { include: { planes_estudio_cie10: true } },
}

const selectBasic = {
  id: true,
  paciente_id: true,
  historia_medica_id: true,
  motivo_consulta: true,
  ant_gine_andro: true,
  estudios_complementarios_efectuados: true,
}

function formatEvolutionNote(n) {
  if (!n) return null
  const { planes_estudio, ...rest } = n
  return {
    ...rest,
    id: toUUID(n.id),
    paciente_id: toUUID(n.paciente_id),
    historia_medica_id: n.historia_medica_id
      ? toUUID(n.historia_medica_id)
      : null,

    planes_estudio: planes_estudio
      ? planes_estudio.map((plan) => ({
          ...plan,
          usuario_id: toUUID(plan.usuario_id),
          nota_evolucion_id: undefined,
          cie10_codes:
            plan.planes_estudio_cie10?.map(({ codigo, descripcion }) => ({
              codigo,
              descripcion,
            })) ?? [],
          planes_estudio_cie10: undefined,
        }))
      : [],
  }
}

function formatMinimal(n) {
  const result = { ...n, id: toUUID(n.id) }
  if ('paciente_id' in n) result.paciente_id = toUUID(n.paciente_id)
  if ('historia_medica_id' in n)
    result.historia_medica_id = toUUID(n.historia_medica_id)
  return result
}

async function upsertAparatosSistemas(tx, notaBuffer, data) {
  await tx.aparatos_sistemas.upsert({
    where: { nota_evolucion_id: notaBuffer },
    create: {
      nota_evolucion_id: notaBuffer,
      historia_medica_id: null,
      ...data,
    },
    update: { ...data },
  })
}

async function upsertInformacionFisica(tx, notaBuffer, data) {
  await tx.informacion_fisica.upsert({
    where: { nota_evolucion_id: notaBuffer },
    create: {
      nota_evolucion_id: notaBuffer,
      historia_medica_id: null,
      ...data,
    },
    update: { ...data },
  })
}

async function replacePlanesEstudio(tx, notaBuffer, planesEstudio, userId) {
  const { cie10_codes, ...rest } = planesEstudio
  await tx.planes_estudio.deleteMany({ where: { nota_evolucion_id: notaBuffer } })
  await tx.planes_estudio.create({
    data: {
      nota_evolucion_id: notaBuffer,
      historia_medica_id: null,
      usuario_id: uuidToBuffer(userId),
      ...rest,
      ...(cie10_codes?.length && {
        planes_estudio_cie10: {
          create: cie10_codes.map(({ codigo, descripcion }) => ({
            codigo,
            descripcion,
          })),
        },
      }),
    },
  })
}

export class EvolutionNoteModel {
  static async getAll({ paciente_id, page, limit, fields } = {}) {
    const where = {}
    if (paciente_id) where.paciente_id = uuidToBuffer(paciente_id)

    const offset = (page - 1) * limit

    const queryOptions = fields
      ? { select: { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) } }
      : { include: includeRelations }

    const [notes, total] = await prisma.$transaction([
      prisma.notas_evolucion.findMany({
        where,
        ...queryOptions,
        orderBy: { id: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.notas_evolucion.count({ where }),
    ])

    const formatter = fields ? formatMinimal : formatEvolutionNote
    return { notes: notes.map(formatter), count: total }
  }

  static async getById(id, tx = prisma) {
    const note = await tx.notas_evolucion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatEvolutionNote(note)
  }

  static async create(data, userId, tx = prisma) {
    const noteId = randomUUID()
    const notaBuffer = uuidToBuffer(noteId)

    await tx.notas_evolucion.create({
      data: {
        id: notaBuffer,
        paciente_id: data.paciente_id ? uuidToBuffer(data.paciente_id) : null,
        historia_medica_id: data.historia_medica_id
          ? uuidToBuffer(data.historia_medica_id)
          : null,
        motivo_consulta: data.motivo_consulta ?? null,
        ant_gine_andro: data.ant_gine_andro ?? null,
        estudios_complementarios_efectuados:
          data.estudios_complementarios_efectuados ?? null,
      },
    })

    if (data.aparatos_sistemas)
      await upsertAparatosSistemas(tx, notaBuffer, data.aparatos_sistemas)
    if (data.informacion_fisica)
      await upsertInformacionFisica(tx, notaBuffer, data.informacion_fisica)
    if (data.planes_estudio)
      await replacePlanesEstudio(tx, notaBuffer, data.planes_estudio, userId)

    return this.getById(noteId, tx)
  }

  static async delete(id) {
    try {
      const note = await prisma.notas_evolucion.delete({
        where: { id: uuidToBuffer(id) },
        include: includeRelations,
      })
      return formatEvolutionNote(note)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data, userId, tx = prisma) {
    try {
      const existing = await tx.notas_evolucion.findUnique({
        where: { id: uuidToBuffer(id) },
        select: selectBasic,
      })
      if (!existing) return null

      await tx.notas_evolucion.update({
        where: { id: uuidToBuffer(id) },
        data: {
          ...(data.paciente_id !== undefined && {
            paciente_id: data.paciente_id
              ? uuidToBuffer(data.paciente_id)
              : null,
          }),
          ...(data.historia_medica_id !== undefined && {
            historia_medica_id: data.historia_medica_id
              ? uuidToBuffer(data.historia_medica_id)
              : null,
          }),
          motivo_consulta: data.motivo_consulta,
          ant_gine_andro: data.ant_gine_andro,
          estudios_complementarios_efectuados:
            data.estudios_complementarios_efectuados,
        },
      })

      const notaBuffer = uuidToBuffer(id)
      if (data.aparatos_sistemas)
        await upsertAparatosSistemas(tx, notaBuffer, data.aparatos_sistemas)
      if (data.informacion_fisica)
        await upsertInformacionFisica(tx, notaBuffer, data.informacion_fisica)
      if (data.planes_estudio)
        await replacePlanesEstudio(tx, notaBuffer, data.planes_estudio, userId)

      return this.getById(id, tx)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
