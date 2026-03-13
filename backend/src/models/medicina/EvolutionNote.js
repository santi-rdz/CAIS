import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'

const includeRelations = {
  pacientes: true,
  historias_medicas: true,
  aparatos_sistemas: true,
  informacion_fisica: true,
  planes_estudio: true,
}

function formatEvolutionNote(n) {
  if (!n) return null
  return {
    id: bufferToUUID(n.id),
    paciente_id: n.paciente_id ? bufferToUUID(n.paciente_id) : null,
    historia_medica_id: n.historia_medica_id
      ? bufferToUUID(n.historia_medica_id)
      : null,
    motivo_consulta: n.motivo_consulta,
    ant_gine_andro: n.ant_gine_andro,
    aparatos_sistemas_id: n.aparatos_sistemas_id,
    aparatos_sistemas: n.aparatos_sistemas ?? null,
    informacion_fisica_id: n.informacion_fisica_id,
    informacion_fisica: n.informacion_fisica ?? null,
    plan_estudio_id: n.plan_estudio_id,
    planes_estudio: n.planes_estudio ?? null,
  }
}

export class EvolutionNoteModel {
  static async getAll({ paciente_id, page, limit } = {}) {
    const where = {}

    if (paciente_id) {
      where.paciente_id = uuidToBuffer(paciente_id)
    }

    const parsedPage = Number(page)
    const parsedLimit = Number(limit)
    const safePage =
      Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10
    const offset = (safePage - 1) * safeLimit

    const [notes, total] = await prisma.$transaction([
      prisma.notas_evolucion.findMany({
        where,
        include: includeRelations,
        skip: offset,
        take: safeLimit,
      }),
      prisma.notas_evolucion.count({ where }),
    ])

    return { notes: notes.map(formatEvolutionNote), count: total }
  }

  static async getById(id, tx = prisma) {
    const evolutionNote = await tx.notas_evolucion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatEvolutionNote(evolutionNote)
  }

  static async create(data, tx = prisma) {
    const noteId = randomUUID()

    await tx.notas_evolucion.create({
      data: {
        id: uuidToBuffer(noteId),
        paciente_id: data.paciente_id ? uuidToBuffer(data.paciente_id) : null,
        historia_medica_id: data.historia_medica_id
          ? uuidToBuffer(data.historia_medica_id)
          : null,
        motivo_consulta: data.motivo_consulta ?? null,
        ant_gine_andro: data.ant_gine_andro ?? null,
        aparatos_sistemas_id: data.aparatos_sistemas_id ?? null,
        informacion_fisica_id: data.informacion_fisica_id ?? null,
        plan_estudio_id: data.plan_estudio_id ?? null,
      },
      include: includeRelations,
    })

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

  static async update(id, data) {
    const fieldMap = {
      motivo_consulta: 'motivo_consulta',
      ant_gine_andro: 'ant_gine_andro',
      aparatos_sistemas_id: 'aparatos_sistemas_id',
      informacion_fisica_id: 'informacion_fisica_id',
      plan_estudio_id: 'plan_estudio_id',
    }

    const prismaData = Object.fromEntries(
      Object.entries(data)
        .filter(([k]) => fieldMap[k])
        .map(([k, v]) => [fieldMap[k], v])
    )

    if (data.paciente_id !== undefined) {
      prismaData.paciente_id = data.paciente_id
        ? uuidToBuffer(data.paciente_id)
        : null
    }
    if (data.historia_medica_id !== undefined) {
      prismaData.historia_medica_id = data.historia_medica_id
        ? uuidToBuffer(data.historia_medica_id)
        : null
    }

    try {
      await prisma.notas_evolucion.update({
        where: { id: uuidToBuffer(id) },
        data: prismaData,
      })
      return await this.getById(id)
    } catch (err) {
      if (err.code === 'P2025') return null
      console.error('Error en EvolutionNoteModel.update:', err)
      throw err
    }
  }
}
