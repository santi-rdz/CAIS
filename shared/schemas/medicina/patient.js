import { z } from 'zod'
import { telefonoSchema, correoSchema, dateSchema, str } from '../fields.js'

export const patientSchema = z.object({
  nombre: z
    .string({ error: 'Debe ser texto' })
    .trim()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),
  apellidos: z
    .string({ error: 'Debe ser texto' })
    .trim()
    .min(2, 'Los apellidos son requeridos')
    .max(255, 'Los apellidos deben tener máximo 255 caracteres'),
  fecha_nacimiento: dateSchema,
  es_externo: z.boolean().optional(),
  correo: z.preprocess((v) => (v === '' ? null : v), correoSchema.nullable().optional()),
  telefono: telefonoSchema,
  genero: z
    .string({ error: 'Debe ser texto' })
    .min(1, 'El género es requerido')
    .max(20, 'El género debe tener máximo 20 caracteres'),
  domicilio: str(),
  fuente_informacion: str(100),
  lugar_nacimiento: str(),
  ocupacion: str(20),
  estado_civil: str(50),
  nivel_educativo: str(20),
  salario_dia: str(20),
  religion: str(100),
  nss: str(20),
  curp_matricula: str(20),
  contacto_emergencia: str(),
  telefono_emergencia: z.preprocess(
    (v) => (v === '' ? null : v),
    telefonoSchema.nullable().optional()
  ),
  parentesco_emergencia: str(100),
})

export function validatePatient(input) {
  return patientSchema.safeParse(input)
}

export function validatePartialPatient(input) {
  return patientSchema.partial().safeParse(input)
}
