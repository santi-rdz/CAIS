import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'

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

    const [
      antecedentes_familiares,
      antecedentes_patologicos,
      aparatos_sistemas,
      informacion_fisica,
      inmunizaciones,
      planes_estudio,
      servicios,
    ] = await Promise.all([
      tx.antecedentes_familiares.create({
        data: {
          padre: data.antecedentes_familiares.padre ?? null,
          madre: data.antecedentes_familiares.madre ?? null,
          abuelo_paterno: data.antecedentes_familiares.abuelo_paterno ?? null,
          abuelo_materno: data.antecedentes_familiares.abuelo_materno ?? null,
          abuela_paterna: data.antecedentes_familiares.abuela_paterna ?? null,
          abuela_materna: data.antecedentes_familiares.abuela_materna ?? null,
          otros: data.antecedentes_familiares.otros ?? null,
        },
      }),
      tx.antecedentes_patologicos.create({
        data: {
          cronico_degenerativos:
            data.antecedentes_patologicos.cronico_degenerativos ?? null,
          quirurgicos: data.antecedentes_patologicos.quirurgicos ?? null,
          hospitalizaciones:
            data.antecedentes_patologicos.hospitalizaciones ?? null,
          traumaticos: data.antecedentes_patologicos.traumaticos ?? null,
          transfusionales:
            data.antecedentes_patologicos.transfusionales ?? null,
          transplantes: data.antecedentes_patologicos.transplantes ?? null,
          alergicos: data.antecedentes_patologicos.alergicos ?? null,
          infectocontagiosos:
            data.antecedentes_patologicos.infectocontagiosos ?? null,
          toxicomanias: data.antecedentes_patologicos.toxicomanias ?? null,
          covid_19: data.antecedentes_patologicos.covid_19 ?? null,
          psicologia_psiquiatria:
            data.antecedentes_patologicos.psicologia_psiquiatria ?? null,
          gyo: data.antecedentes_patologicos.gyo ?? null,
          enfermedades_congenitas:
            data.antecedentes_patologicos.enfermedades_congenitas ?? null,
          enfermedades_infancia:
            data.antecedentes_patologicos.enfermedades_infancia ?? null,
        },
      }),
      tx.aparatos_sistemas.create({
        data: {
          neurologico: data.aparatos_sistemas.neurologico ?? null,
          cardiovascular: data.aparatos_sistemas.cardiovascular ?? null,
          respiratorio: data.aparatos_sistemas.respiratorio ?? null,
          hematologico: data.aparatos_sistemas.hematologico ?? null,
          digestivo: data.aparatos_sistemas.digestivo ?? null,
          musculoesqueletico: data.aparatos_sistemas.musculoesqueletico ?? null,
          genitourinario: data.aparatos_sistemas.genitourinario ?? null,
          endocrinologico: data.aparatos_sistemas.endocrinologico ?? null,
          metabolico: data.aparatos_sistemas.metabolico ?? null,
          nutricional: data.aparatos_sistemas.nutricional ?? null,
        },
      }),
      tx.informacion_fisica.create({
        data: {
          peso: data.informacion_fisica.peso,
          altura: data.informacion_fisica.altura,
          pa_sistolica: data.informacion_fisica.pa_sistolica,
          pa_diastolica: data.informacion_fisica.pa_diastolica,
          fc: data.informacion_fisica.fc,
          fr: data.informacion_fisica.fr,
          circ_cintura: data.informacion_fisica.circ_cintura,
          circ_cadera: data.informacion_fisica.circ_cadera,
          sp_o2: data.informacion_fisica.sp_o2,
          glucosa_capilar: data.informacion_fisica.glucosa_capilar,
          temperatura: data.informacion_fisica.temperatura,
          exploracion_fisica:
            data.informacion_fisica.exploracion_fisica ?? null,
          habito_exterior: data.informacion_fisica.habito_exterior ?? null,
        },
      }),
      tx.inmunizaciones.create({
        data: {
          influenza: data.inmunizaciones.influenza ?? null,
          tetanos: data.inmunizaciones.tetanos ?? null,
          hepatitis_b: data.inmunizaciones.hepatitis_b ?? null,
          covid_19: data.inmunizaciones.covid_19 ?? null,
          otros: data.inmunizaciones.otros ?? null,
        },
      }),
      tx.planes_estudio.create({
        data: {
          usuario_id: uuidToBuffer(data.planes_estudio.usuario_id),
          plan_tratamiento: data.planes_estudio.plan_tratamiento ?? null,
          tratamiento: data.planes_estudio.tratamiento ?? null,
          generado_en: data.planes_estudio.generado_en ?? null,
        },
      }),
      tx.servicios.create({
        data: {
          gas: data.servicios.gas ?? null,
          luz: data.servicios.luz ?? null,
          agua: data.servicios.agua ?? null,
          drenaje: data.servicios.drenaje ?? null,
          cable_tel: data.servicios.cable_tel ?? null,
          internet: data.servicios.internet ?? null,
        },
      }),
    ])

    await tx.historias_medicas.create({
      data: {
        id: uuidToBuffer(historyId),
        paciente_id: uuidToBuffer(data.paciente_id),
        tipo_sangre: data.tipo_sangre ?? null,
        vacunas_infancia_completas: data.vacunas_infancia_completas ?? false,
        motivo_consulta: data.motivo_consulta ?? null,
        historia_enfermedad_actual: data.historia_enfermedad_actual ?? null,
        antecedentes_familiares_id: antecedentes_familiares.id,
        antecedentes_patologicos_id: antecedentes_patologicos.id,
        aparatos_sistemas_id: aparatos_sistemas.id,
        informacion_fisica_id: informacion_fisica.id,
        inmunizaciones_id: inmunizaciones.id,
        plan_estudio_id: planes_estudio.id,
        servicios_id: servicios.id,
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
