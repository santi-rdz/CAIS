export const PASANTE = 'PASANTE'
export const COORDINADOR = 'COORDINADOR'
export const ADMIN = 'ADMIN'
export const ROLES = [PASANTE, COORDINADOR, ADMIN]

export const MEDICINA = 'MEDICINA'
export const NUTRICION = 'NUTRICION'
export const AREAS = [MEDICINA, NUTRICION]

export const ACTIVO = 'ACTIVO'
export const INACTIVO = 'INACTIVO'
export const PENDIENTE = 'PENDIENTE'
export const ESTADOS = [ACTIVO, INACTIVO, PENDIENTE]

// Requisitos de contraseña para auto-registro
export const PASSWORD_REQUIREMENTS = [
  { label: 'Al menos 8 caracteres', test: (v) => v.length >= 8 },
  { label: 'Una letra mayúscula', test: (v) => /[A-Z]/.test(v) },
  { label: 'Una letra minúscula', test: (v) => /[a-z]/.test(v) },
  {
    label: 'Un carácter especial (!@#$%^&*)',
    test: (v) => /[!@#$%^&*]/.test(v),
  },
]

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
