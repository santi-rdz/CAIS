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

// ─── Formatter ───────────────────────────────────────────────────────────────

function formatExamFis(e) {
  if (!e) return null
  return {
    ...e,
    paciente_id: toUUID(e.paciente_id),
  }
}

function formatMinimal(e) {
  return { ...e, paciente_id: toUUID(e.paciente_id) }
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
      where: { id: Number(id) },
      include: includeRelations,
    })
    return formatExamFis(exam)
  }

  /**
   * Crea el registro principal y sus tres tablas relacionadas por FK en una
   * sola transacción. Las FKs (id_perdida_peso, id_signos_vitales, id_semiologia)
   * se resuelven creando primero cada registro hijo y usando su id generado.
   */
  static async create(data, tx = prisma) {
    // 1. Crear los tres registros hijos independientes
    const [perdidaPeso, signosVitales, semiologia] = await Promise.all([
      tx.eval_perdida_peso_nutricion.create({ data: data.eval_perdida_peso ?? {} }),
      tx.signos_vitales_nutricion.create({ data: data.signos_vitales ?? {} }),
      tx.eval_semiologia_nutricional.create({ data: data.semiologia ?? {} }),
    ])

    // 2. Crear el registro principal con las FKs resueltas
    const exam = await tx.exam_fis_orien_nutricion.create({
      data: {
        paciente_id: uuidToBuffer(data.paciente_id),
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        id_perdida_peso: perdidaPeso.id,
        id_signos_vitales: signosVitales.id,
        id_semiologia: semiologia.id,
        // one-to-many
        ...(data.eval_sintomas_gastroin?.length && {
          eval_sintomas_gastroin_nutricion: { create: data.eval_sintomas_gastroin },
        }),
      },
    })

    return this.getById(exam.id, tx)
  }

  /**
   * Elimina el registro principal y sus hijos.
   *
   * Los tres registros independientes (perdida_peso, signos_vitales, semiologia)
   * no tienen ON DELETE CASCADE hacia exam_fis, así que se eliminan manualmente
   * después de borrar el padre (que sí tiene FK hacia ellos).
   * eval_sintomas_gastroin_nutricion sí apunta al padre, así que se limpia primero.
   */
  static async delete(id, tx = prisma) {
    try {
      const numericId = Number(id)

      const exam = await tx.exam_fis_orien_nutricion.findUnique({
        where: { id: numericId },
        include: includeRelations,
      })
      if (!exam) return null

      // Borrar one-to-many y luego el padre
      await tx.eval_sintomas_gastroin_nutricion.deleteMany({
        where: { exam_fis_id: numericId },
      })
      await tx.exam_fis_orien_nutricion.delete({ where: { id: numericId } })

      // Borrar los tres hijos independientes
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

  /**
   * Actualiza el registro principal y reemplaza en su totalidad cada uno de los
   * tres registros hijo cuando se envían en el body.
   */
  static async update(id, data, tx = prisma) {
    try {
      const numericId = Number(id)

      const exam = await tx.exam_fis_orien_nutricion.findUnique({
        where: { id: numericId },
        select: { id_perdida_peso: true, id_signos_vitales: true, id_semiologia: true },
      })
      if (!exam) return null

      // Actualizar hijos si se incluyen en el payload
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
            .deleteMany({ where: { exam_fis_id: numericId } })
            .then(() =>
              data.eval_sintomas_gastroin.length
                ? tx.eval_sintomas_gastroin_nutricion.createMany({
                    data: data.eval_sintomas_gastroin.map((s) => ({
                      ...s,
                      exam_fis_id: numericId,
                    })),
                  })
                : Promise.resolve()
            )
        )
      }

      const mainUpdate =
        data.fecha !== undefined
          ? tx.exam_fis_orien_nutricion.update({
              where: { id: numericId },
              data: { fecha: data.fecha },
            })
          : Promise.resolve()

      await Promise.all([mainUpdate, ...childUpdates])

      return this.getById(numericId, tx)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }
}
