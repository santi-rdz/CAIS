import { z } from 'zod'
import {
  aparatosSistemasSchema,
  informacionFisicaSchema,
  planEstudioSchema,
} from './shared.js'

export const notaEvolucionBaseSchema = z.object({
  motivo_consulta: z.string().nullish(),
  ant_gine_andro: z.string().nullish(),
  estudios_complementarios_efectuados: z.string().nullish(),
})

export const evolutionNoteSchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  historia_medica_id: z.uuid().optional(),
  ...notaEvolucionBaseSchema.shape,
  // IDs directos (retrocompatibilidad)
  aparatos_sistemas_id: z.number().int().positive().optional(),
  informacion_fisica_id: z.number().int().positive().optional(),
  plan_estudio_id: z.number().int().positive().optional(),
  // Creación anidada
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
