import { z } from 'zod'
import { ROLES, AREAS, ESTADOS, PASSWORD_REQUIREMENTS } from '../constants/users.js'

// ── Validaciones de texto ─────────────────────────────────────────────

const soloLetras = (v) => /^[\p{L}\s\-']+$/u.test(v)
const soloLetrasMessage = 'Solo puede contener letras, espacios, guiones y apóstrofes'

// ── Campos reutilizables ──────────────────────────────────────────────

export const correoSchema = z.email('Correo electrónico inválido').max(255)

export const telefonoSchema = z.string().regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos')

export const personalFields = {
  nombre: z
    .string()
    .min(2, 'El nombre es requerido')
    .max(255)
    .refine(soloLetras, soloLetrasMessage),
  apellidos: z
    .string()
    .min(2, 'Los apellidos son requeridos')
    .max(255)
    .refine(soloLetras, soloLetrasMessage),
  telefono: telefonoSchema,
}

export const pasanteFields = {
  matricula: z.string().min(1, 'La matrícula es requerida').max(20),
  servicio_inicio_anio: z.string().min(1, 'Selecciona el año de inicio'),
  servicio_inicio_periodo: z.string().min(1, 'Selecciona el periodo de inicio'),
  servicio_fin_anio: z.string().min(1, 'Selecciona el año de fin'),
  servicio_fin_periodo: z.string().min(1, 'Selecciona el periodo de fin'),
}

export const coordinadorFields = {
  cedula: z.string().min(1, 'La cédula es requerida').max(20),
}

// ── Fechas ────────────────────────────────────────────────────────────

export const dateSchema = z.coerce.date()

export const optionalDateSchema = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.coerce.date().nullable().optional()
)

export const dayjsDateSchema = z.preprocess(
  (v) => {
    if (!v || v === 'invalid') return ''
    if (typeof v === 'object' && typeof v.format === 'function')
      return v.isValid() ? v.format('YYYY-MM-DD') : ''
    return v
  },
  z.string().min(1, 'La fecha es requerida')
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
