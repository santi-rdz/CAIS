import { z } from 'zod'
import { optionalDateSchema } from '../fields.js'

// ─── Schema principal ────────────────────────────────────────────────────────

export const tpanNutritionSchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  fecha_eval: optionalDateSchema,
  eval_realizada: z.string().trim().nullish(),
  observacion: z.string().trim().nullish(),
  estandares_com: z.string().trim().nullish(),
  decision: z.string().trim().nullish(),
  problema_iden: z.string().trim().nullish(),
  causa_probl: z.string().trim().nullish(),
  evidencia_probl: z.string().trim().nullish(),
  progreso: z.int().min(0).max(127).nullish(), // TinyInt
})

// ─── Funciones de validación ─────────────────────────────────────────────────

export function validateTpanNutrition(input) {
  return tpanNutritionSchema.safeParse(input)
}

export function validatePartialTpanNutrition(input) {
  return tpanNutritionSchema.partial().safeParse(input)
}
