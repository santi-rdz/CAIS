import { z } from 'zod'
import { optionalDateSchema } from '../fields.js'

// Campo entero proveniente de formularios: '' → null y string numérico → número.
// Permite que los componentes registren inputs normales y el schema coaccione.
const intField = (max) => {
  let schema = z.coerce.number().int().min(0)
  if (max != null) schema = schema.max(max)
  return z.preprocess((v) => (v === '' ? null : v), schema.nullish())
}

// ─── Subschemas de relaciones one-to-many ────────────────────────────────────

// historias_medicas_nutricion — antecedentes médicos propios del contexto nutricional
export const historiasMedicasNutricionSchema = z.object({
  enfermedad: z.string().trim().nullish(),
  evol: intField(), // Int
  farmacos: z.string().trim().nullish(),
  dosis: z.string().trim().max(20).nullish(),
})

// eval_act_fisica_nutricion — evaluación de actividad física
export const evalActFisicaNutricionSchema = z.object({
  fecha: optionalDateSchema,
  tipo: z.string().trim().max(50).nullish(),
  porque_no: z.string().trim().max(255).nullish(),
  frecuencia: z.string().trim().max(20).nullish(),
  duracion: intField(32767), // SmallInt
  intensidad: intField(), // Int
  tiempo_de_practica: z.string().trim().max(20).nullish(),
  pensamientos_con_realizar_AF: z.string().trim().max(50).nullish(),
})

// eval_cal_sueno — calidad del sueño
export const evalCalSuenoSchema = z.object({
  fecha: optionalDateSchema,
  horas_sueno: intField(127), // TinyInt
  insomnio: intField(127),
  medicacion: intField(127),
})

// tratamiento_alt_nutricion — tratamientos alternativos
export const tratamientoAltNutricionSchema = z.object({
  producto: z.string().trim().nullish(),
  cual_producto: z.string().trim().nullish(),
  mejora: z.string().trim().max(10).nullish(),
  dosis: z.string().trim().max(20).nullish(),
})

// adicciones — objeto único 1:1; se crea anidado junto con la historia
export const adiccionesCreateSchema = z.object({
  adicto_tabaco: z.string().trim().max(10).nullish(),
  tabaco_frecuencia: z.string().trim().max(20).nullish(),
  num_cigarros_d: intField(127), // TinyInt
  adicto_alcohol: z.string().trim().max(10).nullish(),
  alcohol_frecuencia: z.string().trim().max(20).nullish(),
  ml_ocasion: intField(32767), // SmallInt
  adicto_droga: z.string().trim().max(10).nullish(),
  drogas_frecuencia: z.string().trim().max(20).nullish(),
  cual_droga: z.string().trim().nullish(),
  adicto_med_contr: z.string().trim().max(10).nullish(),
  med_contr_frecuencia: z.string().trim().max(20).nullish(),
  cual_med_contr: z.string().trim().nullish(),
})

// ─── Schema principal ────────────────────────────────────────────────────────

export const nutritionHistorySchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  fecha_ingreso: optionalDateSchema,
  motivo_consulta: z.string().trim().nullish(),

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
