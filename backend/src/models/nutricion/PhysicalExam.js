import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { toUUID, nestedCreate, manyCreate, manyReplace } from '#lib/prismaHelpers.js'
import { NotFoundError } from '#lib/appError.js'

// ─── Relaciones a incluir en queries completas ───────────────────────────────

// El examen enlaza a la historia; el paciente_id (y sus nombres) se resuelven
// desde la historia para auditar y tocar el registro del paciente.
const includeRelations = {
  historias_pacientes_nutricion: {
    select: { paciente_id: true, pacientes: { select: { nombre: true, apellidos: true } } },
  },
  eval_perdida_peso_nutricion: true,
  signos_vitales_nutricion: true,
  eval_semiologia_nutricional: true,
  eval_sintomas_gastroin_nutricion: true,
}

// ─── Campos mínimos para listados paginados ───────────────────────────────────

const selectBasic = {
  id: true,
  historia_paciente_id: true,
  fecha: true,
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatExamFis(e) {
  if (!e) return null
  const { historias_pacientes_nutricion, ...rest } = e
  return {
    ...rest,
    id: toUUID(e.id),
    historia_paciente_id: toUUID(e.historia_paciente_id),
    paciente_id: toUUID(historias_pacientes_nutricion?.paciente_id),
    pacientes: historias_pacientes_nutricion?.pacientes,
    eval_sintomas_gastroin_nutricion: e.eval_sintomas_gastroin_nutricion?.map((item) => ({
      ...item,
      exam_fis_id: toUUID(item.exam_fis_id),
    })),
  }
}

function formatMinimal(e) {
  const result = { ...e, id: toUUID(e.id) }
  if ('historia_paciente_id' in e) result.historia_paciente_id = toUUID(e.historia_paciente_id)
  return result
}

// ─── Modelo ──────────────────────────────────────────────────────────────────

export class PhysicalExaminationModel {
  static async getAll({ historia_paciente_id, page, limit, fields } = {}) {
    const where = {}
    if (historia_paciente_id) where.historia_paciente_id = uuidToBuffer(historia_paciente_id)

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
    if (!exam) throw new NotFoundError('el examen físico de orientación')
    return formatExamFis(exam)
  }

  static async create(data, tx = prisma) {
    const examId = randomUUID()

    await tx.exam_fis_orien_nutricion.create({
      data: {
        id: uuidToBuffer(examId),
        historia_paciente_id: uuidToBuffer(data.historia_paciente_id),
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        eval_perdida_peso_nutricion: nestedCreate(data.eval_perdida_peso ?? {}),
        signos_vitales_nutricion: nestedCreate(data.signos_vitales ?? {}),
        eval_semiologia_nutricional: nestedCreate(data.semiologia ?? {}),
        ...(data.eval_sintomas_gastroin?.length && {
          eval_sintomas_gastroin_nutricion: manyCreate(data.eval_sintomas_gastroin),
        }),
      },
    })

    return this.getById(examId, tx)
  }

  // Las 4 sub-tablas guardan exam_fis_id con ON DELETE CASCADE → un delete plano
  // las arrastra. Se lee antes con include para devolver el payload completo.
  static async delete(id, tx = prisma) {
    const idBuffer = uuidToBuffer(id)

    const exam = await tx.exam_fis_orien_nutricion.findUnique({
      where: { id: idBuffer },
      include: includeRelations,
    })
    if (!exam) throw new NotFoundError('el examen físico de orientación')

    await tx.exam_fis_orien_nutricion.delete({ where: { id: idBuffer } })

    return formatExamFis(exam)
  }

  static async update(id, data, tx = prisma) {
    const idBuffer = uuidToBuffer(id)

    const exists = await tx.exam_fis_orien_nutricion.findUnique({ where: { id: idBuffer } })
    if (!exists) throw new NotFoundError('el examen físico de orientación')

    await tx.exam_fis_orien_nutricion.update({
      where: { id: idBuffer },
      data: {
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        // Las 3 sub-tablas to-one siempre existen (se crean con el examen) → update anidado.
        ...(data.eval_perdida_peso !== undefined && {
          eval_perdida_peso_nutricion: { update: data.eval_perdida_peso },
        }),
        ...(data.signos_vitales !== undefined && {
          signos_vitales_nutricion: { update: data.signos_vitales },
        }),
        ...(data.semiologia !== undefined && {
          eval_semiologia_nutricional: { update: data.semiologia },
        }),
        ...(data.eval_sintomas_gastroin !== undefined && {
          eval_sintomas_gastroin_nutricion: manyReplace(data.eval_sintomas_gastroin),
        }),
      },
    })

    return this.getById(id, tx)
  }
}
