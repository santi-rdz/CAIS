import { z } from 'zod'
import { ROLES, AREAS, ESTADOS, PASSWORD_REQUIREMENTS } from '../constants/users.js'

// ── Validaciones de texto ─────────────────────────────────────────────

const soloLetras = (v) => /^[\p{L}\s\-']+$/u.test(v)
const soloLetrasMessage = 'Solo puede contener letras, espacios, guiones y apóstrofes'

// ── Campos reutilizables ──────────────────────────────────────────────

export const correoSchema = z
  .email('Correo electrónico inválido')
  .max(255, 'El correo debe tener máximo 255 caracteres')

export const telefonoSchema = z
  .string({ error: 'Debe ser texto' })
  .regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos')

export const uuidSchema = z.uuid('Debe ser un UUID válido')

// Helper para validar params/queries UUID sin importar zod en los controllers.
export const isUUID = (value) => uuidSchema.safeParse(value).success

// ── Numéricos de formulario ───────────────────────────────────────────
// Coacciona strings de inputs a número, convierte strings vacíos en undefined
// y exige rango. Todo numérico debe declarar max para evitar valores absurdos.
const numericField = ({ min = 0, max, integer = false } = {}) => {
  if (max == null) throw new Error('Los campos numéricos deben declarar max')

  const schema = integer
    ? z.coerce.number({ error: 'Debe ser un número válido' }).int('Debe ser un número entero')
    : z.coerce.number({ error: 'Debe ser un número válido' })
  return z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    schema
      .min(min, `Debe ser mayor o igual a ${min}`)
      .max(max, `Debe ser menor o igual a ${max}`)
      .nullish()
  )
}

export const num = (options) => numericField(options)
export const int = (options) => numericField({ ...options, integer: true })

// ── Strings de formulario ─────────────────────────────────────────────
// trim + tope + nullish. Default 255 para VarChar comunes; campos cortos deben
// pasar su límite explícito.
export const str = (max = 255) =>
  z
    .string({ error: 'Debe ser texto' })
    .trim()
    .max(max, `Debe tener máximo ${max} caracteres`)
    .nullish()

// Texto narrativo: siempre limitado aunque la DB use TEXT.
export const text = (max = 1500) =>
  z
    .string({ error: 'Debe ser texto' })
    .trim()
    .max(max, `Debe tener máximo ${max} caracteres`)
    .nullish()

export const personalFields = {
  nombre: z
    .string()
    .min(2, 'El nombre es requerido')
    .max(255, 'El nombre debe tener máximo 255 caracteres')
    .refine(soloLetras, soloLetrasMessage),
  apellidos: z
    .string()
    .min(2, 'Los apellidos son requeridos')
    .max(255, 'Los apellidos deben tener máximo 255 caracteres')
    .refine(soloLetras, soloLetrasMessage),
  telefono: telefonoSchema,
}

export const pasanteFields = {
  matricula: z
    .string()
    .min(1, 'La matrícula es requerida')
    .max(20, 'La matrícula debe tener máximo 20 caracteres'),
  servicio_inicio_anio: z.string({ error: 'Debe ser texto' }).min(1, 'Selecciona el año de inicio'),
  servicio_inicio_periodo: z
    .string({ error: 'Debe ser texto' })
    .min(1, 'Selecciona el periodo de inicio'),
  servicio_fin_anio: z.string({ error: 'Debe ser texto' }).min(1, 'Selecciona el año de fin'),
  servicio_fin_periodo: z
    .string({ error: 'Debe ser texto' })
    .min(1, 'Selecciona el periodo de fin'),
}

export const coordinadorFields = {
  cedula: z
    .string()
    .min(1, 'La cédula es requerida')
    .max(20, 'La cédula debe tener máximo 20 caracteres'),
}

// ── Fechas ────────────────────────────────────────────────────────────

export const dateSchema = z.coerce.date({ error: 'Fecha inválida' })

export const optionalDateSchema = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.coerce.date({ error: 'Fecha inválida' }).nullable().optional()
)

export const dayjsDateSchema = z.preprocess(
  (v) => {
    if (!v || v === 'invalid') return ''
    if (typeof v === 'object' && typeof v.format === 'function')
      return v.isValid() ? v.format('YYYY-MM-DD') : ''
    return v
  },
  z.string({ error: 'Fecha inválida' }).min(1, 'La fecha es requerida')
)

export const isoDateTimeSchema = z.iso.datetime({
  offset: true,
  message: 'Fecha y hora inválidas',
})

export const fechaHoraFormFields = {
  fecha: z.any().refine((v) => v && v !== 'invalid', { message: 'Ingresa la fecha' }),
  hora: z.any().refine((v) => v !== null && v !== undefined, {
    message: 'Ingresa la hora',
  }),
}

// ── Enums ─────────────────────────────────────────────────────────────

const uppercaseEnum = (values, error) =>
  z
    .string()
    .transform((v) => v.toUpperCase())
    .pipe(z.enum(values, { error }))

export const rolSchema = uppercaseEnum(Object.values(ROLES), 'Rol inválido')

export const areaSchema = uppercaseEnum(Object.values(AREAS), 'Área inválida')

export const estadoSchema = uppercaseEnum(Object.values(ESTADOS), 'Estado inválido')

// ── Passwords ─────────────────────────────────────────────────────────

export const passwordSchema = z
  .string()
  .refine((v) => PASSWORD_REQUIREMENTS[0].test(v), PASSWORD_REQUIREMENTS[0].label)
  .refine((v) => PASSWORD_REQUIREMENTS[1].test(v), PASSWORD_REQUIREMENTS[1].label)
  .refine((v) => PASSWORD_REQUIREMENTS[2].test(v), PASSWORD_REQUIREMENTS[2].label)
  .refine((v) => PASSWORD_REQUIREMENTS[3].test(v), PASSWORD_REQUIREMENTS[3].label)

export const basicPasswordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')

// ── Refinements ───────────────────────────────────────────────────────

export const withPasswordConfirmation = (schema) =>
  schema.refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
