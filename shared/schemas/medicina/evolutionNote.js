import { z } from 'zod'
import { isoDateTimeSchema, text, uuidSchema } from '../fields.js'
import { aparatosSistemasSchema, informacionFisicaSchema, planEstudioSchema } from './shared.js'

// Schema único para backend y form
export const evolutionNoteSchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  historia_medica_id: uuidSchema.optional(),
  creado_at: isoDateTimeSchema,
  motivo_consulta: text(),
  ant_gine_andro: text(),
  estudios_complementarios_efectuados: text(),
  aparatos_sistemas: aparatosSistemasSchema.optional(),
  informacion_fisica: informacionFisicaSchema.optional(),
  planes_estudio: planEstudioSchema.optional(),
})

export function validateEvolutionNote(input) {
  return evolutionNoteSchema.safeParse(input)
}

export function validatePartialEvolutionNote(input) {
  return evolutionNoteSchema.partial().safeParse(input)
}
