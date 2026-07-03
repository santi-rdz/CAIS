export const ROLES = {
  PASANTE: 'PASANTE',
  COORDINADOR: 'COORDINADOR',
  ADMIN: 'ADMIN',
}

export const AREAS = {
  MEDICINA: 'MEDICINA',
  NUTRICION: 'NUTRICION',
}

export const ESTADOS = {
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
  PENDIENTE: 'PENDIENTE',
}

export const ACCIONES = {
  CREAR: 'CREAR',
  ACTUALIZAR: 'ACTUALIZAR',
  ELIMINAR: 'ELIMINAR',
  INICIAR_SESION: 'INICIAR_SESION',
}

export const ENTIDADES = {
  NOTA_EVOLUCION: 'NOTA_EVOLUCION',
  EXAM_FIS_ORIEN_NUTRICION: 'EXAMINACION_FISICA',
  TPAN: 'TPAN',
  HISTORIA_MEDICA: 'HISTORIA_MEDICA',
  HISTORIA_NUTRICION: 'HISTORIA_NUTRICION',
  EVAL_BIOQ_NUTRICION: 'EVAL_BIOQ_NUTRICION',
  EVAL_NUTRICIONAL: 'EVAL_NUTRICIONAL',
  EVAL_ACT_FISICA_NUTRICION: 'EVAL_ACT_FISICA_NUTRICION',
  EVAL_CAL_SUENO: 'EVAL_CAL_SUENO',
  EMERGENCIA: 'EMERGENCIA',
  PACIENTE: 'PACIENTE',
  USUARIO: 'USUARIO',
}

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
