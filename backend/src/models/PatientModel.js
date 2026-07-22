import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { formatDefs } from '#lib/formatDef.js'
import {
  PATIENT_SORT_DEFS,
  SIMILAR_PATIENT_THRESHOLD,
  SIMILAR_PATIENT_LIMIT,
} from '@cais/shared/constants/patients'
import { NotFoundError, ConflictError } from '#lib/appError.js'
import { normalizeName, nameSimilarity } from '#lib/similarity.js'

const includeRelations = {
  pacientes_areas: { select: { area_id: true } },
}

const SORT_OPTIONS = formatDefs(PATIENT_SORT_DEFS)

function formatPatient(u) {
  if (!u) return null
  const { pacientes_areas, ...rest } = u
  return {
    ...rest,
    id: bufferToUUID(u.id),
    doctor_id: bufferToUUID(u.doctor_id),
    areas: pacientes_areas.map((pa) => pa.area_id),
  }
}

export class PatientModel {
  static async getAll({ sortBy, search, page, limit, genre, areaId }) {
    const where = {}

    if (areaId != null) {
      where.pacientes_areas = { some: { area_id: areaId } }
    }

    if (search) {
      const tokens = search.trim().split(/\s+/).filter(Boolean)
      where.AND = tokens.map((token) => ({
        OR: [
          { nombre: { contains: token } },
          { apellidos: { contains: token } },
          { telefono: { contains: token } },
        ],
      }))
    }

    const orderBy = sortBy && SORT_OPTIONS[sortBy] ? SORT_OPTIONS[sortBy] : { creado_at: 'desc' }

    if (genre) {
      where.genero = genre
    }
    const offset = (page - 1) * limit

    const [patients, total] = await prisma.$transaction([
      prisma.pacientes.findMany({
        where,
        include: includeRelations,
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.pacientes.count({ where }),
    ])

    return { patients: patients.map(formatPatient), count: total }
  }

  static async getById(id, tx = prisma) {
    const patient = await tx.pacientes.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    if (!patient) throw new NotFoundError('el paciente')
    return formatPatient(patient)
  }

  static async delete(id, tx = prisma) {
    const existing = await tx.pacientes.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('el paciente')
    await tx.pacientes.delete({ where: { id: uuidToBuffer(id) } })
  }

  static async update(id, data, tx = prisma) {
    const existing = await tx.pacientes.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('el paciente')

    await tx.pacientes.update({
      where: { id: uuidToBuffer(id) },
      data: { ...data, actualizado_at: new Date() },
    })
    return this.getById(id, tx)
  }

  static async touch(id, tx = prisma) {
    await tx.pacientes.update({
      where: { id: uuidToBuffer(id) },
      data: { actualizado_at: new Date() },
    })
  }

  static async create(data, userId, areaId, tx = prisma) {
    const patientId = randomUUID()

    await tx.pacientes.create({
      data: {
        ...data,
        id: uuidToBuffer(patientId),
        doctor_id: uuidToBuffer(userId),
        pacientes_areas: { create: { area_id: areaId, doctor_id: uuidToBuffer(userId) } },
      },
    })

    return this.getById(patientId, tx)
  }

  // Candidatos a sincronizar desde otra área: ancla exacta (fecha de nacimiento
  // y género) + similitud difusa de nombre. Devuelve solo identidad mínima —
  // nada clínico ni PII extendida, porque cruza el aislamiento por área.
  static async findSimilar({ nombre, apellidos, fecha_nacimiento, genero, excludeAreaId }) {
    const candidates = await prisma.pacientes.findMany({
      where: {
        fecha_nacimiento,
        genero,
        // Debe pertenecer a alguna área pero no a la del solicitante (excluye
        // pacientes huérfanos sin membresía, que no son sincronizables).
        pacientes_areas: {
          some: {},
          none: { area_id: excludeAreaId },
        },
      },
      take: SIMILAR_PATIENT_LIMIT,
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        fecha_nacimiento: true,
        genero: true,
        pacientes_areas: { select: { areas: { select: { nombre: true } } } },
      },
    })

    const target = normalizeName(`${nombre} ${apellidos}`)
    return candidates
      .map((c) => ({
        id: bufferToUUID(c.id),
        nombre: c.nombre,
        apellidos: c.apellidos,
        fecha_nacimiento: c.fecha_nacimiento,
        genero: c.genero,
        areas: c.pacientes_areas.map((pa) => pa.areas.nombre),
        score: nameSimilarity(target, normalizeName(`${c.nombre} ${c.apellidos}`)),
      }))
      .filter((c) => c.score >= SIMILAR_PATIENT_THRESHOLD)
      .sort((a, b) => b.score - a.score)
  }

  // Datos complementarios al sincronizar: solo escribe campos que la ficha
  // existente tiene vacíos — nunca sobrescribe lo capturado por la otra área.
  static async fillMissing(id, data, tx = prisma) {
    const existing = await tx.pacientes.findUnique({ where: { id: uuidToBuffer(id) } })
    if (!existing) throw new NotFoundError('el paciente')

    const missing = {}
    for (const [key, value] of Object.entries(data)) {
      const current = existing[key]
      if (value != null && value !== '' && (current == null || current === '')) {
        missing[key] = value
      }
    }
    if (Object.keys(missing).length === 0) return

    await tx.pacientes.update({
      where: { id: uuidToBuffer(id) },
      data: { ...missing, actualizado_at: new Date() },
    })
  }

  static async addArea(id, areaId, userId, tx = prisma) {
    const idBuffer = uuidToBuffer(id)
    const exists = await tx.pacientes.findUnique({ where: { id: idBuffer }, select: { id: true } })
    if (!exists) throw new NotFoundError('el paciente')

    const already = await tx.pacientes_areas.findUnique({
      where: { paciente_id_area_id: { paciente_id: idBuffer, area_id: areaId } },
      select: { area_id: true },
    })
    if (already) throw new ConflictError('El paciente ya pertenece a esta área')

    await tx.pacientes_areas.create({
      data: { paciente_id: idBuffer, area_id: areaId, doctor_id: uuidToBuffer(userId) },
    })
  }
}
