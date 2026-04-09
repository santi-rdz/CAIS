import { z } from 'zod'
import { telefonoSchema, correoSchema } from '../fields.js'

export const patientSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es requerido'),
  fecha_nacimiento: z.coerce.date(),
  es_externo: z.boolean().optional(),
  correo: z.preprocess(
    (v) => (v === '' ? null : v),
    correoSchema.nullable().optional()
  ),
  telefono: telefonoSchema,
  genero: z.string().min(1, 'El género es requerido'),
  domicilio: z.string().optional(),
  fuente_informacion: z.string().optional(),
  lugar_nacimiento: z.string().optional(),
  ocupacion: z.string().optional(),
  estado_civil: z.string().optional(),
  nivel_educativo: z.string().optional(),
  religion: z.string().optional(),
  nss: z.string().optional(),
  curp_matricula: z.string().optional(),
  contacto_emergencia: z.string().optional(),
  telefono_emergencia: z.preprocess(
    (v) => (v === '' ? null : v),
    telefonoSchema.nullable().optional()
  ),
  parentesco_emergencia: z.string().optional(),
})

export function validatePatient(input) {
  return patientSchema.safeParse(input)
}

export function validatePartialPatient(input) {
  return patientSchema.partial().safeParse(input)
}
