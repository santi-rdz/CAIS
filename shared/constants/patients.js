// Búsqueda de pacientes similares en la otra área (sincronización).
export const SIMILAR_PATIENT_THRESHOLD = 0.75
export const SIMILAR_PATIENT_MIN_CHARS = 2
// Cota superior de candidatos que el backend evalúa/devuelve (el ancla ya filtra
// fuerte; esto acota el escaneo difuso ante fechas+género muy comunes).
export const SIMILAR_PATIENT_LIMIT = 25

export const PATIENT_SORT_KEYS = {
  NOMBRE_ASC: 'nombre-asc',
  NOMBRE_DESC: 'nombre-desc',
  ACTUALIZACION_ASC: 'actualizacion-asc',
  ACTUALIZACION_DESC: 'actualizacion-desc',
  NACIMIENTO_ASC: 'nacimiento-asc',
  NACIMIENTO_DESC: 'nacimiento-desc',
}

export const PATIENT_SORT_DEFS = [
  { key: PATIENT_SORT_KEYS.NOMBRE_ASC, field: 'nombre', dir: 'asc' },
  { key: PATIENT_SORT_KEYS.NOMBRE_DESC, field: 'nombre', dir: 'desc' },
  {
    key: PATIENT_SORT_KEYS.ACTUALIZACION_ASC,
    field: 'actualizado_at',
    dir: 'asc',
  },
  {
    key: PATIENT_SORT_KEYS.ACTUALIZACION_DESC,
    field: 'actualizado_at',
    dir: 'desc',
  },
  {
    key: PATIENT_SORT_KEYS.NACIMIENTO_ASC,
    field: 'fecha_nacimiento',
    dir: 'asc',
  },
  {
    key: PATIENT_SORT_KEYS.NACIMIENTO_DESC,
    field: 'fecha_nacimiento',
    dir: 'desc',
  },
]
