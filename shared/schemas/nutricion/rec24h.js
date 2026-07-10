import { z } from 'zod'
import { optionalDateSchema, str, num } from '../fields.js'

// Rangos estimados por alimento/comida individual (no por día completo).
// Ajusta si nutrición define límites distintos.
export const rec24hComidaSchema = z.object({
  fecha: optionalDateSchema,
  comida: str(100), // p. ej. "Desayuno", "Colación 1"
  alimento: str(100),
  calorias: num({ min: 0, max: 5000 }), // kcal
  grasa: num({ min: 0, max: 500 }), // g
  colesterol: num({ min: 0, max: 2000 }), // mg
  sodio: num({ min: 0, max: 10000 }), // mg
  carb: num({ min: 0, max: 1000 }), // g
  proteinas: num({ min: 0, max: 1000 }), // g
  azucar: num({ min: 0, max: 1000 }), // g
  fibra: num({ min: 0, max: 500 }), // g
})

// Schema base sin refine, reutilizado para el update parcial
const rec24hObjectSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia del paciente debe ser un UUID válido'),
  fecha_eval: optionalDateSchema,
  comidas: z.array(rec24hComidaSchema).max(50, 'Máximo 50 comidas por recordatorio').optional(),
})

export const rec24hSchema = rec24hObjectSchema

export function validateRec24h(input) {
  return rec24hSchema.safeParse(input)
}

export function validatePartialRec24h(input) {
  return rec24hObjectSchema.partial().safeParse(input)
}
