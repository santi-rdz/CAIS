import { z } from 'zod'

const emptyToUndefined = z.literal('').transform(() => undefined)
const coerceNum = z.coerce.number().positive().optional().or(emptyToUndefined)
const coerceInt = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .or(emptyToUndefined)

export const aparatosSistemasSchema = z.object({
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

export const informacionFisicaSchema = z.object({
  peso: coerceNum,
  altura: coerceNum,
  pa_sistolica: coerceInt,
  pa_diastolica: coerceInt,
  fc: coerceInt,
  fr: coerceInt,
  circ_cintura: coerceNum,
  circ_cadera: coerceNum,
  sp_o2: coerceNum,
  glucosa_capilar: coerceNum,
  temperatura: coerceNum,
  exploracion_fisica: z.string().optional(),
  habito_exterior: z.string().optional(),
})

// Schema para validación de API (cie10_codes como strings)
export const planEstudioSchema = z.object({
  plan_tratamiento: z.string().optional(),
  tratamiento: z.string().optional(),
  estudios_complementarios: z.string().optional(),
  cie10_codes: z.array(z.string()).optional(),
  generado_en: z.coerce.date().nullable().optional(),
})

// Schema para el form (cie10_codes como objetos {codigo, descripcion})
export const planEstudioFormSchema = planEstudioSchema.extend({
  cie10_codes: z
    .array(z.object({ codigo: z.string(), descripcion: z.string() }))
    .optional(),
})

export const notaEvolucionBaseSchema = z.object({
  motivo_consulta: z.string().optional(),
  ant_gine_andro: z.string().optional(),
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
  plan_estudio: planEstudioSchema.optional(),
})

export function validateEvolutionNote(input) {
  return evolutionNoteSchema.safeParse(input)
}

export function validatePartialEvolutionNote(input) {
  return evolutionNoteSchema.partial().safeParse(input)
}
