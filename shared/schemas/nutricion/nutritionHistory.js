import { z } from 'zod'
import { optionalDateSchema, int, str, text } from '../fields.js'
import { evalActFisicaSchema } from './evalActFisica.js'
import { evalCalSuenoSchema as evalCalSuenoBaseSchema } from './evalCalSueno.js'

// ─── Subschemas de relaciones one-to-many ────────────────────────────────────

// historias_medicas_nutricion — antecedentes médicos propios del contexto nutricional
export const historiasMedicasNutricionSchema = z.object({
  enfermedad: text(),
  evol: int({ max: 150 }), // Int
  farmacos: text(),
  dosis: str(20),
})

// eval_act_fisica_nutricion y eval_cal_sueno son recursos atómicos con ruta
// propia; aquí se anidan al crear la historia, sin la FK historia_paciente_id
// (la resuelve la creación del padre). Fuente única en sus schemas atómicos.
export const evalActFisicaNutricionSchema = evalActFisicaSchema.omit({
  historia_paciente_id: true,
})

export const evalCalSuenoSchema = evalCalSuenoBaseSchema.omit({ historia_paciente_id: true })

// tratamiento_alt_nutricion — tratamientos alternativos
export const tratamientoAltNutricionSchema = z.object({
  producto: text(),
  cual_producto: text(),
  mejora: str(10),
  dosis: str(20),
})

// adicciones — objeto único 1:1; se crea anidado junto con la historia
export const adiccionesCreateSchema = z.object({
  adicto_tabaco: str(10),
  tabaco_frecuencia: str(20),
  num_cigarros_d: int({ max: 127 }), // TinyInt
  adicto_alcohol: str(10),
  alcohol_frecuencia: str(20),
  ml_ocasion: int({ max: 32767 }), // SmallInt
  adicto_droga: str(10),
  drogas_frecuencia: str(20),
  cual_droga: text(),
  adicto_med_contr: str(10),
  med_contr_frecuencia: str(20),
  cual_med_contr: text(),
})

// ─── Schema principal ────────────────────────────────────────────────────────

export const nutritionHistorySchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  fecha_ingreso: optionalDateSchema,
  motivo_consulta: text(),

  // adicciones 1:1: se crea anidada junto con la historia
  adicciones: adiccionesCreateSchema.optional(),

  // Relaciones one-to-many: arreglos opcionales
  historias_medicas_nutricion: z.array(historiasMedicasNutricionSchema).optional(),
  eval_act_fisica_nutricion: z.array(evalActFisicaNutricionSchema).optional(),
  eval_cal_sueno: z.array(evalCalSuenoSchema).optional(),
  tratamiento_alt_nutricion: z.array(tratamientoAltNutricionSchema).optional(),
})

// ─── Funciones de validación ─────────────────────────────────────────────────

export function validateNutritionHistory(input) {
  return nutritionHistorySchema.safeParse(input)
}

export function validatePartialNutritionHistory(input) {
  return nutritionHistorySchema.partial().safeParse(input)
}
