import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { create } from 'node:domain'

const includeRelations = {
  antecedentes_familiares: true,
  antecedentes_patologicos: true,
  aparatos_sistemas: true,
  informacion_fisica: true,
  inmunizaciones: true,
  pacientes: true,
  planes_estudio: true,
  servicios: true,
}

function formatMedicalHistory(n) {
  if (!n) return null
  const {
    antecedentes_familiares,
    antecedentes_patologicos,
    aparatos_sistemas,
    informacion_fisica,
    inmunizaciones,
    pacientes,
    planes_estudio,
    servicios,
    ...rest
  } = n
  return {
    ...rest,
    id: bufferToUUID(n.id),
    paciente_id: n.paciente_id ? bufferToUUID(n.paciente_id) : null,
  }
}

export class MedicalHistoryModel {
  static async getAll({ paciente_id, page, limit } = {}) {
    const where = {}

    if (paciente_id) {
      where.paciente_id = uuidToBuffer(paciente_id)
    }

    const offset = (page - 1) * limit

    const [histories, total] = await prisma.$transaction([
      prisma.historias_medicas.findMany({
        where,
        include: includeRelations,
        skip: offset,
        take: limit,
      }),
      prisma.historias_medicas.count({ where }),
    ])

    return { histories: histories.map(formatMedicalHistory), count: total }
  }

  static async getById(id, tx = prisma) {
    const history = await tx.historias_medicas.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatMedicalHistory(history)
  }

  static async create(data, tx = prisma) {
    const historyId = randomUUID()

    await tx.historias_medicas.create({
      data: {
        id: uuidToBuffer(historyId),
        paciente_id: uuidToBuffer(data.paciente_id),
        tipo_sangre: data.tipo_sangre ?? null,
        vacunas_infancia_completas: data.vacunas_infancia_completas ?? false,
        motivo_consulta: data.motivo_consulta ?? null,
        historia_enfermedad_actual: data.historia_enfermedad_actual ?? null,
        antecedentes_familiares: {
          create: {
            ...data.antecedentes_familiares,
          },
        },
        antecedentes_patologicos: {
          create: {
            ...data.antecedentes_patologicos,
          },
        },
        aparatos_sistemas: {
          create: {
            ...data.aparatos_sistemas,
          },
        },
        informacion_fisica: {
          create: {
            ...data.informacion_fisica,
          },
        },
        inmunizaciones: {
          create: {
            ...data.inmunizaciones,
          },
        },
        planes_estudio: {
          create: {
            usuario_id: uuidToBuffer(data.planes_estudio.usuario_id),
            plan_tratamiento: data.planes_estudio.plan_tratamiento ?? null,
            tratamiento: data.planes_estudio.tratamiento ?? null,
            generado_en: data.planes_estudio.generado_en ?? null,
          },
        },
        servicios: {
          create: {
            ...data.servicios,
          },
        },
      },
      include: includeRelations,
    })
    return this.getById(historyId, tx)
  }

  static async delete(id) {
    try {
      const history = await prisma.historias_medicas.delete({
        where: { id: uuidToBuffer(id) },
        include: includeRelations,
      })
      return formatMedicalHistory(history)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data) {
    const { paciente_id, ...rest } = data
    const prismaData = { ...rest }

    if (paciente_id !== undefined)
      prismaData.paciente_id = paciente_id ? uuidToBuffer(paciente_id) : null

    try {
      await prisma.historias_medicas.update({
        where: { id: uuidToBuffer(id) },
        data: prismaData,
      })
      return await this.getById(id)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
