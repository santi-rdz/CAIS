import { bufferToUUID } from '#lib/uuid.js'

/**
 * Convierte un valor BINARY(16) de la DB a string UUID.
 * Maneja Buffer, objeto con bytes (resultado de Prisma) y valores ya convertidos.
 */
export const toUUID = (val) => {
  if (!val) return null
  if (Buffer.isBuffer(val)) return bufferToUUID(val)
  if (typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date))
    return bufferToUUID(Buffer.from(Object.values(val)))
  return val
}

/**
 * Envuelve un objeto en la estructura { create: {...} } que Prisma
 * espera para crear una relación anidada en un create.
 */
export const nestedCreate = (val) => ({ create: { ...val } })

/**
 * Envuelve un objeto en la estructura { upsert: { create, update } } que Prisma
 * espera para crear o actualizar una relación 1:1 anidada en un update.
 */
export const nestedUpsert = (val) => ({
  upsert: { create: { ...val }, update: { ...val } },
})

/**
 * Construye el objeto de relaciones anidadas para un create o update de Prisma.
 * Solo incluye las keys que existan en data para no sobreescribir relaciones no enviadas.
 *
 * @param {object} data - Payload validado por Zod
 * @param {string[]} keys - Lista de relaciones a procesar (ej. NESTED_RELATIONS)
 * @param {function} nestedFn - nestedCreate o nestedUpsert según la operación
 */
export function buildNestedRelations(data, keys, nestedFn) {
  const result = {}
  for (const key of keys) {
    if (data[key]) result[key] = nestedFn(data[key])
  }
  return result
}

/**
 * Construye los códigos CIE-10 anidados para un create de planes_estudio.
 * Retorna vacío si no hay códigos.
 */
function buildCie10Nested(cie10_codes) {
  if (!cie10_codes?.length) return {}
  return {
    planes_estudio_cie10: {
      create: cie10_codes.map(({ codigo, descripcion }) => ({
        codigo,
        descripcion,
      })),
    },
  }
}

/**
 * Construye la estructura Prisma para crear un plan_estudio anidado
 * dentro de un create de historia médica. Incluye los códigos CIE-10.
 */
export function planesEstudioCreate(planesEstudio) {
  const { cie10_codes, ...rest } = planesEstudio
  return {
    create: {
      ...rest,
      ...buildCie10Nested(cie10_codes),
    },
  }
}

/**
 * Construye la estructura Prisma para crear o actualizar un plan_estudio anidado
 * dentro de un update de historia médica.
 * En el update, los CIE-10 se reemplazan completos (deleteMany + create)
 * para evitar duplicados y mantener sincronía con el frontend.
 */
export function planesEstudioUpsert(planesEstudio) {
  const { cie10_codes, ...rest } = planesEstudio
  const cie10Create = cie10_codes?.length
    ? {
        planes_estudio_cie10: {
          create: cie10_codes.map(({ codigo, descripcion }) => ({
            codigo,
            descripcion,
          })),
        },
      }
    : {}
  const cie10Update = cie10_codes
    ? {
        planes_estudio_cie10: {
          deleteMany: {},
          create: cie10_codes.map(({ codigo, descripcion }) => ({
            codigo,
            descripcion,
          })),
        },
      }
    : {}
  return {
    upsert: {
      create: { ...rest, ...cie10Create },
      update: { ...rest, ...cie10Update },
    },
  }
}
