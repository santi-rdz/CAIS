import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'

const includeRelations = {
  rec_24h_comidas: true,
}

// Objetivos nutricionales del día: columnas planas del padre.
const OBJECTIVE_FIELDS = [
  'obj_calorias',
  'obj_grasa',
  'obj_colesterol',
  'obj_sodio',
  'obj_carb',
  'obj_proteinas',
  'obj_azucar',
  'obj_fibra',
]

const pickObjectives = (data) =>
  Object.fromEntries(OBJECTIVE_FIELDS.filter((f) => data[f] !== undefined).map((f) => [f, data[f]]))

function formatRec24h(n, paciente_id) {
  if (!n) return null
  return {
    ...n,
    id: toUUID(n.id),
    historia_paciente_id: toUUID(n.historia_paciente_id),
    ...(paciente_id ? { paciente_id } : {}),
  }
}

async function getPacienteId(historiaPacienteId, tx) {
  const historia = await tx.historias_pacientes_nutricion.findUnique({
    where: { id: uuidToBuffer(historiaPacienteId) },
    select: { paciente_id: true },
  })
  if (!historia) throw new NotFoundError('la historia del paciente')
  return toUUID(historia.paciente_id)
}

export class Rec24hModel {
  static async getAll({ historia_paciente_id, page, limit } = {}) {
    const where = {}
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

    const offset = (page - 1) * limit

    const [recs, total] = await prisma.$transaction([
      prisma.rec_24h_nutricion.findMany({
        where,
        include: includeRelations,
        orderBy: [{ fecha_eval: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.rec_24h_nutricion.count({ where }),
    ])

    return { recs: recs.map((r) => formatRec24h(r)), count: total }
  }

  static async getById(id, tx = prisma) {
    const rec = await tx.rec_24h_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!rec) throw new NotFoundError('el recordatorio de 24 horas')
    return formatRec24h(rec)
  }

  static async create(data, tx = prisma) {
    const paciente_id = await getPacienteId(data.historia_paciente_id, tx)
    const recId = randomUUID()

    const created = await tx.rec_24h_nutricion.create({
      data: {
        id: uuidToBuffer(recId),
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        fecha_eval: data.fecha_eval,
        ...pickObjectives(data),
        ...(data.comidas?.length && {
          rec_24h_comidas: { create: data.comidas },
        }),
      },
      include: includeRelations,
    })

    return formatRec24h(created, paciente_id)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.rec_24h_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!existing) throw new NotFoundError('el recordatorio de 24 horas')

    const paciente_id = await getPacienteId(toUUID(existing.historia_paciente_id), tx)

    await tx.rec_24h_nutricion.delete({ where: { id: uuidToBuffer(id) } })

    return formatRec24h(existing, paciente_id)
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.rec_24h_nutricion.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('el recordatorio de 24 horas')

    await tx.rec_24h_nutricion.update({
      where: { id: uuidToBuffer(id) },
      data: {
        ...(data.fecha_eval !== undefined && { fecha_eval: data.fecha_eval }),
        ...pickObjectives(data),
      },
    })

    if (data.comidas !== undefined) {
      await tx.rec_24h_comidas.deleteMany({ where: { rec_24h_id: uuidToBuffer(id) } })
      if (data.comidas.length > 0) {
        await tx.rec_24h_comidas.createMany({
          data: data.comidas.map((c) => ({ ...c, rec_24h_id: uuidToBuffer(id) })),
        })
      }
    }

    const paciente_id = await getPacienteId(toUUID(existing.historia_paciente_id), tx)
    const updated = await this.getById(id, tx)
    return { ...updated, paciente_id }
  }
}
