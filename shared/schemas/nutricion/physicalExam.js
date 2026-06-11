import { z } from 'zod'
import { optionalDateSchema } from '../fields.js'

// ─── Subschemas de tablas relacionadas ───────────────────────────────────────

// eval_perdida_peso_nutricion
export const evalPerdidaPesoSchema = z.object({
  peso_habitual: z.number().nullish(),
  peso_perdido: z.number().nullish(),
  porcentaje_peso_perdido: z.number().nullish(),
})

// signos_vitales_nutricion
export const signosVitalesNutricionSchema = z.object({
  tas: z.number().nullish(),
  tad: z.number().nullish(),
  temperatura: z.number().nullish(),
  dificultad_respiratoria: z.boolean().nullish(),
})

// eval_semiologia_nutricional
export const evalSemiologiaNutricionalSchema = z.object({
  pcb: z.string().trim().max(10).nullish(),
  pct: z.string().trim().max(10).nullish(),
  fondo_ojo: z.string().trim().max(10).nullish(),
  diag_reservagrasa: z.string().trim().max(10).nullish(),
  sienes: z.string().trim().max(10).nullish(),
  clavicula: z.string().trim().max(10).nullish(),
  hombros: z.string().trim().max(10).nullish(),
  omoplato: z.string().trim().max(10).nullish(),
  interoseos_mano: z.string().trim().max(10).nullish(),
  costillas: z.string().trim().max(10).nullish(),
  espalda_alta: z.string().trim().max(10).nullish(),
  cuadriceps: z.string().trim().max(10).nullish(),
  pantorrilla: z.string().trim().max(10).nullish(),
  diag_reserva_muscular: z.string().trim().max(15).nullish(),
  edema: z.string().trim().max(20).nullish(),
  descripcion: z.string().trim().nullish(),
  descripcion_sist_genito_urinario: z.string().trim().nullish(),
})

// eval_sintomas_gastroin_nutricion — one-to-many
export const evalSintomasGastroinSchema = z.object({
  presenta_sgi: z.boolean().nullish(),
  presencia: z.string().trim().max(50).nullish(),
})

// ─── Schema principal ────────────────────────────────────────────────────────

export const physicalExaminationSchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  fecha: optionalDateSchema,

  // Objetos requeridos: se crean junto con el registro principal
  eval_perdida_peso: evalPerdidaPesoSchema,
  signos_vitales: signosVitalesNutricionSchema,
  semiologia: evalSemiologiaNutricionalSchema,

  // One-to-many opcional
  eval_sintomas_gastroin: z.array(evalSintomasGastroinSchema).optional(),
})

// ─── Funciones de validación ─────────────────────────────────────────────────

export function validatePhysicalExamination(input) {
  return physicalExaminationSchema.safeParse(input)
}

export function validatePartialPhysicalExamination(input) {
  return physicalExaminationSchema.partial().safeParse(input)
}
