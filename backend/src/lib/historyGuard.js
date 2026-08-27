import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { NotFoundError } from '#lib/appError.js'

// Impide crear recursos hijos colgando de una historia soft-deleted (evita datos
// clínicos huérfanos e invisibles bajo un padre borrado). Lanza NotFoundError,
// que el controller no atrapa.

export async function assertActiveNutritionHistory(id, tx = prisma) {
  const historia = await tx.historias_pacientes_nutricion.findFirst({
    where: { id: uuidToBuffer(id), deleted_at: null },
    select: { id: true },
  })
  if (!historia) throw new NotFoundError('la historia de nutrición')
}

export async function assertActiveMedicalHistory(id, tx = prisma) {
  const historia = await tx.historias_medicas.findFirst({
    where: { id: uuidToBuffer(id), deleted_at: null },
    select: { id: true },
  })
  if (!historia) throw new NotFoundError('la historia médica')
}
