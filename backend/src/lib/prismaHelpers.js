import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'

export const toUUID = (val) => {
  if (!val) return null
  if (Buffer.isBuffer(val)) return bufferToUUID(val)
  if (typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date))
    return bufferToUUID(Buffer.from(Object.values(val)))
  return val
}

export const nestedCreate = (val) => ({ create: { ...val } })
export const nestedUpsert = (val) => ({
  upsert: { create: { ...val }, update: { ...val } },
})

function buildCie10Nested(cie10_codes) {
  if (!cie10_codes?.length) return {}
  return {
    planes_estudio_cie10: {
      create: cie10_codes.map(({ codigo, descripcion }) => ({ codigo, descripcion })),
    },
  }
}

export function planesEstudioCreate(planesEstudio, userId) {
  const { cie10_codes, ...rest } = planesEstudio
  return {
    create: {
      ...rest,
      usuario_id: uuidToBuffer(userId),
      ...buildCie10Nested(cie10_codes),
    },
  }
}

export function planesEstudioUpsert(planesEstudio, userId) {
  const { cie10_codes, ...rest } = planesEstudio
  const cie10Create = cie10_codes?.length
    ? { planes_estudio_cie10: { create: cie10_codes.map(({ codigo, descripcion }) => ({ codigo, descripcion })) } }
    : {}
  const cie10Update = cie10_codes
    ? { planes_estudio_cie10: { deleteMany: {}, create: cie10_codes.map(({ codigo, descripcion }) => ({ codigo, descripcion })) } }
    : {}
  return {
    upsert: {
      create: { ...rest, usuario_id: uuidToBuffer(userId), ...cie10Create },
      update: { ...rest, ...cie10Update },
    },
  }
}
