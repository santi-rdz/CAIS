export const EMERGENCY_SORT_KEYS = {
  FECHA_ASC: 'fecha-asc',
  FECHA_DESC: 'fecha-desc',
  NOMBRE_ASC: 'nombre-asc',
  NOMBRE_DESC: 'nombre-desc',
}

export const EMERGENCY_SORT_DEFS = [
  { key: EMERGENCY_SORT_KEYS.FECHA_ASC, field: 'fecha_hora', dir: 'asc' },
  { key: EMERGENCY_SORT_KEYS.FECHA_DESC, field: 'fecha_hora', dir: 'desc' },
  { key: EMERGENCY_SORT_KEYS.NOMBRE_ASC, field: 'nombre', dir: 'asc' },
  { key: EMERGENCY_SORT_KEYS.NOMBRE_DESC, field: 'nombre', dir: 'desc' },
]
