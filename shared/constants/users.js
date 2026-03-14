// Claves de ordenamiento válidas para usuarios
export const USER_SORT_KEYS = {
  NOMBRE_ASC: 'nombre-asc',
  NOMBRE_DESC: 'nombre-desc',
  LOGIN_ASC: 'login-asc',
  LOGIN_DESC: 'login-desc',
}

// Definiciones completas — el backend las usa para construir el orderBy de Prisma
export const USER_SORT_DEFS = [
  { key: USER_SORT_KEYS.NOMBRE_ASC, field: 'nombre', dir: 'asc' },
  { key: USER_SORT_KEYS.NOMBRE_DESC, field: 'nombre', dir: 'desc' },
  { key: USER_SORT_KEYS.LOGIN_ASC, field: 'ultimo_acceso', dir: 'asc' },
  { key: USER_SORT_KEYS.LOGIN_DESC, field: 'ultimo_acceso', dir: 'desc' },
]
