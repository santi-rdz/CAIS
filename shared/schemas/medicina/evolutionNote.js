import { z } from 'zod'

export const evolutionNoteSchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  historia_medica_id: z.uuid().optional(),
  motivo_consulta: z.string().optional(),
  ant_gine_andro: z.string().optional(),
  aparatos_sistemas_id: z.number().int().positive().optional(),
  informacion_fisica_id: z.number().int().positive().optional(),
  plan_estudio_id: z.number().int().positive().optional(),
})

export function validateEvolutionNote(input) {
  return evolutionNoteSchema.safeParse(input)
}

export function validatePartialEvolutionNote(input) {
  return evolutionNoteSchema.partial().safeParse(input)
}
