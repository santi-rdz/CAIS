import { z } from 'zod'

// Helpers internos de coerción para campos numéricos de formularios
const emptyToUndefined = z.literal('').transform(() => undefined)
export const coerceNum = z.coerce
  .number()
  .positive()
  .optional()
  .or(emptyToUndefined)
export const coerceInt = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .or(emptyToUndefined)

// ─── Schemas compartidos entre evolutionNote y medicalHistory ────────

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

// planes_estudio_cie10.codigo es VarChar(10) en DB
const cie10ItemSchema = z.object({
  codigo: z.string().max(10),
  descripcion: z.string().nullish(),
})

export const planEstudioSchema = z.object({
  plan_tratamiento: z.string().nullish(),
  tratamiento: z.string().nullish(),
  estudios_complementarios: z.string().nullish(),
  cie10_codes: z.array(cie10ItemSchema).optional(),
})
