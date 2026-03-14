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
