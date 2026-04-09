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
  neurologico: z.string().nullish(),
  cardiovascular: z.string().nullish(),
  respiratorio: z.string().nullish(),
  hematologico: z.string().nullish(),
  digestivo: z.string().nullish(),
  musculoesqueletico: z.string().nullish(),
  genitourinario: z.string().nullish(),
  endocrinologico: z.string().nullish(),
  metabolico: z.string().nullish(),
  nutricional: z.string().nullish(),
})

export const informacionFisicaSchema = z
  .object({
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
    exploracion_fisica: z.string().nullish(),
    habito_exterior: z.string().nullish(),
  })
  .partial()

const cie10ItemSchema = z.object({
  codigo: z.string(),
  descripcion: z.string().nullish(),
})

export const planEstudioSchema = z.object({
  plan_tratamiento: z.string().nullish(),
  tratamiento: z.string().nullish(),
  estudios_complementarios: z.string().nullish(),
  cie10_codes: z.array(cie10ItemSchema).optional(),
})

// Alias para compatibilidad con imports existentes
export const planEstudioFormSchema = planEstudioSchema

export const notaEvolucionBaseSchema = z.object({
  motivo_consulta: z.string().nullish(),
  ant_gine_andro: z.string().nullish(),
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
