import { z } from 'zod'
import { personaBaseFields, correoSchema, passwordSchema } from './fields.js'

// ─── Campos compartidos ─────────────────────────────────────────────

const tempPasswordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')

const coreFields = {
  ...personaBaseFields,
  fechaNacimiento: z.string(),
}

const internFields = {
  matricula: z.string().min(1, 'La matrícula es requerida'),
  servicioInicioAnio: z.string().min(1, 'Selecciona el año de inicio'),
  servicioInicioPeriodo: z.string().min(1, 'Selecciona el periodo de inicio'),
  servicioFinAnio: z.string().min(1, 'Selecciona el año de fin'),
  servicioFinPeriodo: z.string().min(1, 'Selecciona el periodo de fin'),
}

const cedulaField = {
  cedula: z.string().min(1, 'La cédula es requerida'),
}

const passwordConfirmRefine = (schema) =>
  schema.refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

// Convierte objetos dayjs (date pickers del FE) a string 'YYYY-MM-DD'
const dayjsDateSchema = z.preprocess(
  (v) => {
    if (!v || v === 'invalid') return ''
    if (typeof v === 'object' && typeof v.format === 'function')
      return v.format('YYYY-MM-DD')
    return v
  },
  z.string().min(1, 'La fecha es requerida')
)

// ─── BE: Creación directa por admin ─────────────────────────────────

const adminCreateBase = z.object({
  ...coreFields,
  password: tempPasswordSchema,
  correo: correoSchema,
  rol: z.enum(['pasante', 'coordinador'], {
    errorMap: () => ({ message: 'El rol debe ser pasante o coordinador' }),
  }),
})

export const internCreateSchema = adminCreateBase.extend(internFields)
export const coordCreateSchema = adminCreateBase.extend(cedulaField)

export function validateAdminCreate(input) {
  const rol = input?.rol
  if (rol === 'coordinador') return coordCreateSchema.safeParse(input)
  return internCreateSchema.safeParse(input)
}

export function validateUserUpdate(input) {
  return adminCreateBase.partial().safeParse(input)
}

// ─── BE: Auto-registro con token ────────────────────────────────────

const selfRegisterBase = z.object({
  ...coreFields,
  password: passwordSchema,
  token: z.uuid('Token inválido'),
  confirmPassword: z.string(),
})

export const internSelfRegisterSchema = passwordConfirmRefine(
  selfRegisterBase.extend(internFields)
)

export const coordSelfRegisterSchema = passwordConfirmRefine(
  selfRegisterBase.extend(cedulaField)
)

export function validateSelfRegister(input, rol) {
  if (rol === 'COORDINADOR') return coordSelfRegisterSchema.safeParse(input)
  return internSelfRegisterSchema.safeParse(input)
}

// ─── FE: Schemas derivados para react-hook-form ─────────────────────
// Se derivan de los schemas BE con .omit() / .extend() para evitar
// duplicación. Solo cambian: fechaNacimiento (dayjs), correo (relajado),
// y se quitan campos que el FE inyecta aparte (rol, token).

const overrides = {
  fechaNacimiento: dayjsDateSchema,
  // Si contiene '@' se valida formato email; sin '@' es usuario de dominio.
  correo: z
    .string()
    .min(1, 'Ingresa un usuario')
    .refine(
      (val) => !val.includes('@') || z.email().safeParse(val).success,
      'Ingresa un correo válido'
    ),
}

export const internCreateFormSchema = internCreateSchema
  .omit({ rol: true })
  .extend(overrides)

export const coordCreateFormSchema = coordCreateSchema
  .omit({ rol: true })
  .extend(overrides)

const signupFormBase = selfRegisterBase
  .omit({ token: true })
  .extend({ fechaNacimiento: dayjsDateSchema })

export const internSignupFormSchema = passwordConfirmRefine(
  signupFormBase.extend(internFields)
)

export const coordSignupFormSchema = passwordConfirmRefine(
  signupFormBase.extend(cedulaField)
)
