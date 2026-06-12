import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID } from '#lib/prismaHelpers.js'

// ─── Relaciones a incluir en queries completas ───────────────────────────────

const includeRelations = {
  pacientes: { select: { nombre: true, apellidos: true } },
  eval_perdida_peso_nutricion: true,
  signos_vitales_nutricion: true,
  eval_semiologia_nutricional: true,
  eval_sintomas_gastroin_nutricion: true,
}

// ─── Campos mínimos para listados paginados ───────────────────────────────────

const selectBasic = {
  id: true,
  paciente_id: true,
  fecha: true,
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatExamFis(e) {
  if (!e) return null
  return {
    ...e,
    id: toUUID(e.id),
    paciente_id: toUUID(e.paciente_id),
    eval_sintomas_gastroin_nutricion: e.eval_sintomas_gastroin_nutricion?.map((item) => ({
      ...item,
      exam_fis_id: toUUID(item.exam_fis_id),
    })),
  }
}

function formatMinimal(e) {
  const result = { ...e, id: toUUID(e.id) }
  if ('paciente_id' in e) result.paciente_id = toUUID(e.paciente_id)
  return result
}

// ─── Modelo ──────────────────────────────────────────────────────────────────

export class PhysicalExaminationModel {
  static async getAll({ paciente_id, page, limit, fields } = {}) {
    const where = {}
    if (paciente_id) where.paciente_id = uuidToBuffer(paciente_id)

    const offset = (page - 1) * limit

    const queryOptions = {
      select: fields
        ? { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) }
        : selectBasic,
    }

    const [exams, total] = await prisma.$transaction([
      prisma.exam_fis_orien_nutricion.findMany({
        where,
        ...queryOptions,
        orderBy: [{ fecha: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.exam_fis_orien_nutricion.count({ where }),
    ])

    return { exams: exams.map(formatMinimal), count: total }
  }

  static async getById(id, tx = prisma) {
    const exam = await tx.exam_fis_orien_nutricion.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatExamFis(exam)
  }

  /**
   * Crea el registro principal y sus tres tablas relacionadas por FK.
   * Los tres hijos (perdida_peso, signos_vitales, semiologia) se crean primero
   * porque el padre guarda sus IDs como FK.
   */
  static async create(data, tx = prisma) {
    if (!tx) return prisma.$transaction((trx) => this.create(data, trx))
    const examId = randomUUID()

    // 1. Crear los tres registros hijos independientes
    const [perdidaPeso, signosVitales, semiologia] = await Promise.all([
      tx.eval_perdida_peso_nutricion.create({ data: data.eval_perdida_peso ?? {} }),
      tx.signos_vitales_nutricion.create({ data: data.signos_vitales ?? {} }),
      tx.eval_semiologia_nutricional.create({ data: data.semiologia ?? {} }),
    ])

    // 2. Crear el registro principal con UUID y FKs resueltas
    await tx.exam_fis_orien_nutricion.create({
      data: {
        id: uuidToBuffer(examId),
        paciente_id: uuidToBuffer(data.paciente_id),
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        id_perdida_peso: perdidaPeso.id,
        id_signos_vitales: signosVitales.id,
        id_semiologia: semiologia.id,
        ...(data.eval_sintomas_gastroin?.length && {
          eval_sintomas_gastroin_nutricion: { create: data.eval_sintomas_gastroin },
        }),
      },
    })

    return this.getById(examId, tx)
  }

  /**
   * Elimina el registro y sus hijos.
   *
   * eval_sintomas_gastroin apunta al padre → se borra primero.
   * Los tres registros hijos independientes (perdida_peso, signos_vitales,
   * semiologia) apuntan desde el padre como FK → se borran después del padre.
   */
  static async delete(id, tx = prisma) {
    if (!tx) return prisma.$transaction((trx) => this.delete(id, trx))
    try {
      const idBuffer = uuidToBuffer(id)

      const exam = await tx.exam_fis_orien_nutricion.findUnique({
        where: { id: idBuffer },
        include: includeRelations,
      })
      if (!exam) return null

      await tx.eval_sintomas_gastroin_nutricion.deleteMany({
        where: { exam_fis_id: idBuffer },
      })
      await tx.exam_fis_orien_nutricion.delete({ where: { id: idBuffer } })

      await Promise.all([
        tx.eval_perdida_peso_nutricion.delete({ where: { id: exam.id_perdida_peso } }),
        tx.signos_vitales_nutricion.delete({ where: { id: exam.id_signos_vitales } }),
        tx.eval_semiologia_nutricional.delete({ where: { id: exam.id_semiologia } }),
      ])

      return formatExamFis(exam)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async update(id, data, tx = prisma) {
    if (!tx) return prisma.$transaction((trx) => this.update(id, data, trx))
    try {
      const idBuffer = uuidToBuffer(id)

      const exam = await tx.exam_fis_orien_nutricion.findUnique({
        where: { id: idBuffer },
        select: { id_perdida_peso: true, id_signos_vitales: true, id_semiologia: true },
      })
      if (!exam) return null

      const childUpdates = []

      if (data.eval_perdida_peso !== undefined) {
        childUpdates.push(
          tx.eval_perdida_peso_nutricion.update({
            where: { id: exam.id_perdida_peso },
            data: data.eval_perdida_peso,
          })
        )
      }
      if (data.signos_vitales !== undefined) {
        childUpdates.push(
          tx.signos_vitales_nutricion.update({
            where: { id: exam.id_signos_vitales },
            data: data.signos_vitales,
          })
        )
      }
      if (data.semiologia !== undefined) {
        childUpdates.push(
          tx.eval_semiologia_nutricional.update({
            where: { id: exam.id_semiologia },
            data: data.semiologia,
          })
        )
      }
      if (data.eval_sintomas_gastroin !== undefined) {
        childUpdates.push(
          tx.eval_sintomas_gastroin_nutricion
            .deleteMany({ where: { exam_fis_id: idBuffer } })
            .then(() =>
              data.eval_sintomas_gastroin.length
                ? tx.eval_sintomas_gastroin_nutricion.createMany({
                    data: data.eval_sintomas_gastroin.map((s) => ({ ...s, exam_fis_id: idBuffer })),
                  })
                : Promise.resolve()
            )
        )
      }

      const mainUpdate =
        data.fecha !== undefined
          ? tx.exam_fis_orien_nutricion.update({
              where: { id: idBuffer },
              data: { fecha: data.fecha },
            })
          : Promise.resolve()

      await Promise.all([mainUpdate, ...childUpdates])

      return this.getById(id, tx)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
