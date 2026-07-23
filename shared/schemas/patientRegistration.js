import { z } from 'zod'
import { uuidSchema } from './fields.js'

// Registro atómico ({ patient }) o sincronización a un paciente existente de la
// otra área ({ paciente_id }). Al sincronizar, `patient` es opcional y parcial:
// lleva solo los datos complementarios que la otra área no captura (el backend
// nunca sobrescribe campos ya capturados).
export function makeRegistrationSchema(patientSchema, historiaSchema) {
  const historia = historiaSchema.omit({ paciente_id: true })
  const createSchema = z.object({ patient: patientSchema, historia })
  const syncSchema = z.object({
    paciente_id: uuidSchema,
    patient: patientSchema.partial().optional(),
    historia,
  })
  // Discrimina por presencia de la clave (no por truthiness): así un
  // `paciente_id: ''` cae en syncSchema y uuidSchema lo rechaza, en vez de
  // colarse a createSchema y crear un paciente nuevo.
  return (input) =>
    input && 'paciente_id' in input ? syncSchema.safeParse(input) : createSchema.safeParse(input)
}
