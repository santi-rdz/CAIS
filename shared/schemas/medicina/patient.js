import { z } from 'zod'
import { telefonoSchema, correoSchema, dateSchema } from '../fields.js'

export const patientSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es requerido').max(255),
  fecha_nacimiento: dateSchema,
  es_externo: z.boolean().optional(),
  correo: z.preprocess(
    (v) => (v === '' ? null : v),
    correoSchema.nullable().optional()
  ),
  telefono: telefonoSchema,
  genero: z.string().min(1, 'El género es requerido').max(20),
  domicilio: z.string().max(255).optional(),
  fuente_informacion: z.string().max(100).optional(),
  lugar_nacimiento: z.string().max(255).optional(),
  ocupacion: z.string().max(100).optional(),
  estado_civil: z.string().max(50).optional(),
  nivel_educativo: z.string().max(100).optional(),
  religion: z.string().max(100).optional(),
  nss: z.string().max(50).optional(),
  curp_matricula: z.string().max(50).optional(),
  contacto_emergencia: z.string().max(255).optional(),
  telefono_emergencia: z.preprocess(
    (v) => (v === '' ? null : v),
    telefonoSchema.nullable().optional()
  ),
  parentesco_emergencia: z.string().max(100).optional(),
})

export function validatePatient(input) {
  return patientSchema.safeParse(input)
}

export function validatePartialPatient(input) {
  return patientSchema.partial().safeParse(input)
}
