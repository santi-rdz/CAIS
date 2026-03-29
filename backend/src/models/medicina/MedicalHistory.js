import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { create } from 'node:domain'

const includeRelations = {
  antecedentes_familiares: true,
  antecedentes_patologicos: true,
  antecedentes_no_patologicos: true,
  aparatos_sistemas: true,
  informacion_fisica: true,
  inmunizaciones: true,
  pacientes: true,
  planes_estudio: true,
  servicios: true,
}

const toUUID = (val) => {
  if (!val) return null
  if (Buffer.isBuffer(val)) return bufferToUUID(val)
  if (
    typeof val === 'object' &&
    !Array.isArray(val) &&
    !(val instanceof Date)
  ) {
    return bufferToUUID(Buffer.from(Object.values(val)))
  }
  return val
}

function formatMedicalHistory(n) {
  if (!n) return null
  const {
    antecedentes_familiares,
    antecedentes_patologicos,
    antecedentes_no_patologicos,
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
    id: toUUID(n.id),
    paciente_id: toUUID(n.paciente_id),

    antecedentes_familiares: antecedentes_familiares
      ? {
          ...antecedentes_familiares,
          historia_medica_id: toUUID(
            antecedentes_familiares.historia_medica_id
          ),
        }
      : null,

    antecedentes_patologicos: antecedentes_patologicos
      ? {
          ...antecedentes_patologicos,
          historia_medica_id: toUUID(
            antecedentes_patologicos.historia_medica_id
          ),
        }
      : null,

    antecedentes_no_patologicos: antecedentes_no_patologicos
      ? {
          ...antecedentes_no_patologicos,
          historia_medica_id: toUUID(
            antecedentes_no_patologicos.historia_medica_id
          ),
        }
      : null,

    aparatos_sistemas: aparatos_sistemas
      ? {
          ...aparatos_sistemas,
          historia_medica_id: toUUID(aparatos_sistemas.historia_medica_id),
        }
      : null,

    informacion_fisica: informacion_fisica
      ? {
          ...informacion_fisica,
          historia_medica_id: toUUID(informacion_fisica.historia_medica_id),
        }
      : null,

    inmunizaciones: inmunizaciones
      ? {
          ...inmunizaciones,
          historia_medica_id: toUUID(inmunizaciones.historia_medica_id),
        }
      : null,

    pacientes: pacientes
      ? {
          ...pacientes,
          id: toUUID(pacientes.id),
          doctor_id: toUUID(pacientes.doctor_id),
        }
      : null,

    planes_estudio: planes_estudio
      ? {
          ...planes_estudio,
          id: toUUID(planes_estudio.id),
          usuario_id: toUUID(planes_estudio.usuario_id),
          historia_medica_id: toUUID(planes_estudio.historia_medica_id),
        }
      : null,

    servicios: servicios
      ? {
          ...servicios,
          historia_medica_id: toUUID(servicios.historia_medica_id),
        }
      : null,
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

        ...(data.antecedentes_familiares && {
          antecedentes_familiares: {
            create: {
              ...data.antecedentes_familiares,
            },
          },
        }),
        ...(data.antecedentes_patologicos && {
          antecedentes_patologicos: {
            create: {
              ...data.antecedentes_patologicos,
            },
          },
        }),
        ...(data.antecedentes_no_patologicos && {
          antecedentes_no_patologicos: {
            create: {
              ...data.antecedentes_no_patologicos,
            },
          },
        }),
        ...(data.aparatos_sistemas && {
          aparatos_sistemas: {
            create: {
              ...data.aparatos_sistemas,
            },
          },
        }),
        ...(data.informacion_fisica && {
          informacion_fisica: {
            create: {
              ...data.informacion_fisica,
            },
          },
        }),
        ...(data.inmunizaciones && {
          inmunizaciones: {
            create: {
              ...data.inmunizaciones,
            },
          },
        }),
        ...(data.planes_estudio && {
          planes_estudio: {
            create: {
              usuario_id: uuidToBuffer(data.planes_estudio.usuario_id),
              plan_tratamiento: data.planes_estudio.plan_tratamiento ?? null,
              tratamiento: data.planes_estudio.tratamiento ?? null,
              generado_en: data.planes_estudio.generado_en ?? null,
            },
          },
        }),
        ...(data.servicios && {
          servicios: {
            create: {
              ...data.servicios,
            },
          },
        }),
      },
      include: includeRelations,
    })
    return this.getById(historyId, tx)
  }

  static async delete(id) {
    try {
      const bufId = uuidToBuffer(id)
      return await prisma.$transaction(async (tx) => {
        const history = await tx.historias_medicas.findUnique({
          where: { id: bufId },
          include: includeRelations,
        })
        if (!history) return null

        // Delete grandchildren before children
        const plans = await tx.planes_estudio.findMany({
          where: { historia_medica_id: bufId },
          select: { id: true },
        })
        if (plans.length) {
          await tx.planes_estudio_cie10.deleteMany({
            where: { plan_estudio_id: { in: plans.map((p) => p.id) } },
          })
        }

        // Delete all direct children (all have onDelete: NoAction)
        await tx.antecedentes_familiares.deleteMany({ where: { historia_medica_id: bufId } })
        await tx.antecedentes_patologicos.deleteMany({ where: { historia_medica_id: bufId } })
        await tx.antecedentes_no_patologicos.deleteMany({ where: { historia_medica_id: bufId } })
        await tx.aparatos_sistemas.deleteMany({ where: { historia_medica_id: bufId } })
        await tx.informacion_fisica.deleteMany({ where: { historia_medica_id: bufId } })
        await tx.inmunizaciones.deleteMany({ where: { historia_medica_id: bufId } })
        await tx.planes_estudio.deleteMany({ where: { historia_medica_id: bufId } })
        await tx.servicios.deleteMany({ where: { historia_medica_id: bufId } })
        await tx.notas_evolucion.deleteMany({ where: { historia_medica_id: bufId } })

        await tx.historias_medicas.delete({ where: { id: bufId } })
        return formatMedicalHistory(history)
      })
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data) {
    try {
      await prisma.historias_medicas.update({
        where: { id: uuidToBuffer(id) },
        data: {
          tipo_sangre: data.tipo_sangre,
          vacunas_infancia_completas: data.vacunas_infancia_completas,
          motivo_consulta: data.motivo_consulta,
          historia_enfermedad_actual: data.historia_enfermedad_actual,

          ...(data.antecedentes_familiares && {
            antecedentes_familiares: {
              upsert: {
                create: { ...data.antecedentes_familiares },
                update: { ...data.antecedentes_familiares },
              },
            },
          }),

          ...(data.antecedentes_patologicos && {
            antecedentes_patologicos: {
              upsert: {
                create: { ...data.antecedentes_patologicos },
                update: { ...data.antecedentes_patologicos },
              },
            },
          }),

          ...(data.antecedentes_no_patologicos && {
            antecedentes_no_patologicos: {
              upsert: {
                create: { ...data.antecedentes_no_patologicos },
                update: { ...data.antecedentes_no_patologicos },
              },
            },
          }),

          ...(data.aparatos_sistemas && {
            aparatos_sistemas: {
              upsert: {
                create: { ...data.aparatos_sistemas },
                update: { ...data.aparatos_sistemas },
              },
            },
          }),

          ...(data.informacion_fisica && {
            informacion_fisica: {
              upsert: {
                create: { ...data.informacion_fisica },
                update: { ...data.informacion_fisica },
              },
            },
          }),

          ...(data.inmunizaciones && {
            inmunizaciones: {
              upsert: {
                create: { ...data.inmunizaciones },
                update: { ...data.inmunizaciones },
              },
            },
          }),

          ...(data.planes_estudio && {
            planes_estudio: {
              upsert: {
                create: {
                  usuario_id: uuidToBuffer(data.planes_estudio.usuario_id),
                  plan_tratamiento:
                    data.planes_estudio.plan_tratamiento ?? null,
                  tratamiento: data.planes_estudio.tratamiento ?? null,
                  generado_en: data.planes_estudio.generado_en ?? null,
                },
                update: {
                  plan_tratamiento: data.planes_estudio.plan_tratamiento,
                  tratamiento: data.planes_estudio.tratamiento,
                  generado_en: data.planes_estudio.generado_en,
                },
              },
            },
          }),

          ...(data.servicios && {
            servicios: {
              upsert: {
                create: { ...data.servicios },
                update: { ...data.servicios },
              },
            },
          }),
        },
      })

      return await this.getById(id)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
