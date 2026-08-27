// Campos sobre los que corre la búsqueda libre (`?search=`) de cada listado.
// Backend-only (nombres de columna Prisma), por eso no viven en `shared/`.
// Los consume `buildSearchWhere` en los modelos.

export const PATIENT_SEARCH_FIELDS = ['nombre', 'apellidos', 'telefono']

export const USER_SEARCH_FIELDS = ['nombre', 'apellidos', 'correo']

export const EMERGENCY_SEARCH_FIELDS = [
  'nombre',
  'ubicacion',
  'matricula',
  'telefono',
  'diagnostico',
  'accion_realizada',
]
