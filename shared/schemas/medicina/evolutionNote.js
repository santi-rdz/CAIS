import { z } from 'zod'
import { isoDateTimeSchema } from '../fields.js'
import {
  aparatosSistemasSchema,
  informacionFisicaSchema,
  planEstudioSchema,
} from './shared.js'

// Schema único para backend y form
export const evolutionNoteSchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  historia_medica_id: z.uuid().optional(),
  creado_at: isoDateTimeSchema,
  motivo_consulta: z.string().trim().nullish(),
  ant_gine_andro: z.string().trim().nullish(),
  estudios_complementarios_efectuados: z.string().trim().nullish(),
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
