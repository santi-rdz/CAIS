import { z } from 'zod'
import { optionalDateSchema, int } from '../fields.js'

// Los campos son TinyInt en la DB (cantidad de unidades de intercambio que
// el paciente comerá de cada grupo). El máximo de 30 es una estimación
// razonable de raciones diarias; ajústalo si tu equipo de nutrición maneja
// otro tope.
const equivalente = () => int({ min: 0, max: 30 })

const calGetNutrObjectSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia del paciente debe ser un UUID válido'),
  fecha_eval: optionalDateSchema,
  verdura: equivalente(),
  fruta: equivalente(),
  cereal_sin_grasa: equivalente(),
  cereal_con_grasa: equivalente(),
  leguminosas: equivalente(),
  aoa_a: equivalente(),
  aoa_b: equivalente(),
  aoa_c: equivalente(),
  aoa_d: equivalente(),
  leche_a: equivalente(),
  leche_b: equivalente(),
  leche_c: equivalente(),
  grasa_a: equivalente(),
  grasa_b: equivalente(),
  azucares: equivalente(),
  rice_dream: equivalente(),
  silk: equivalente(),
  soyactive: equivalente(),
  almond_breeze: equivalente(),
  aube_baja: equivalente(),
  nan_one: equivalente(),
  aube_alta: equivalente(),
})

export const calGetNutrSchema = calGetNutrObjectSchema

export function validateCalGetNutr(input) {
  return calGetNutrSchema.safeParse(input)
}

export function validatePartialCalGetNutr(input) {
  return calGetNutrObjectSchema.omit({ historia_paciente_id: true }).partial().safeParse(input)
}
