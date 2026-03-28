import { z } from 'zod'

const aparatosSistemasSchema = z.object({
  neurologico: z.string().optional(),
  cardiovascular: z.string().optional(),
  respiratorio: z.string().optional(),
  hematologico: z.string().optional(),
  digestivo: z.string().optional(),
  musculoesqueletico: z.string().optional(),
  genitourinario: z.string().optional(),
  endocrinologico: z.string().optional(),
  metabolico: z.string().optional(),
  nutricional: z.string().optional(),
})

const informacionFisicaSchema = z.object({
  peso: z.number().optional(),
  altura: z.number().optional(),
  pa_sistolica: z.number().int().optional(),
  pa_diastolica: z.number().int().optional(),
  fc: z.number().int().optional(),
  fr: z.number().int().optional(),
  circ_cintura: z.number().optional(),
  circ_cadera: z.number().optional(),
  sp_o2: z.number().optional(),
  glucosa_capilar: z.number().optional(),
  temperatura: z.number().optional(),
  exploracion_fisica: z.string().optional(),
  habito_exterior: z.string().optional(),
})

const planEstudioSchema = z.object({
  plan_tratamiento: z.string().optional(),
  tratamiento: z.string().optional(),
  cie10_codes: z.array(z.string()).optional(),
  generado_en: z.coerce.date().nullable().optional(),
})

export const evolutionNoteSchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  historia_medica_id: z.uuid().optional(),
  motivo_consulta: z.string().optional(),
  ant_gine_andro: z.string().optional(),
  // IDs directos (retrocompatibilidad)
  aparatos_sistemas_id: z.number().int().positive().optional(),
  informacion_fisica_id: z.number().int().positive().optional(),
  plan_estudio_id: z.number().int().positive().optional(),
  // Creación anidada
  aparatos_sistemas: aparatosSistemasSchema.optional(),
  informacion_fisica: informacionFisicaSchema.optional(),
  plan_estudio: planEstudioSchema.optional(),
})

export function validateEvolutionNote(input) {
  return evolutionNoteSchema.safeParse(input)
}

export function validatePartialEvolutionNote(input) {
  return evolutionNoteSchema.partial().safeParse(input)
}
