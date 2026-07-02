import { z } from 'zod'
import { optionalDateSchema, num, str, text } from '../fields.js'

// ─── Subschemas de tablas relacionadas ───────────────────────────────────────
// Numéricos: num coacciona strings del FE, '' → undefined y valida rango clínico.

// eval_perdida_peso_nutricion
export const evalPerdidaPesoSchema = z.object({
  peso_habitual: num({ max: 500 }),
  peso_perdido: num({ max: 500 }),
  porcentaje_peso_perdido: num({ max: 100 }),
})

// signos_vitales_nutricion
export const signosVitalesNutricionSchema = z.object({
  tas: num({ max: 300 }),
  tad: num({ max: 200 }),
  temperatura: num({ max: 45 }),
  dificultad_respiratoria: z.boolean().nullish(),
})

// eval_semiologia_nutricional — la mayoría son VarChar(10)
export const evalSemiologiaNutricionalSchema = z.object({
  pcb: str(),
  pct: str(),
  fondo_ojo: str(),
  diag_reservagrasa: str(),
  sienes: str(),
  clavicula: str(),
  hombros: str(),
  omoplato: str(),
  interoseos_mano: str(),
  costillas: str(),
  espalda_alta: str(),
  cuadriceps: str(),
  pantorrilla: str(),
  diag_reserva_muscular: str(15),
  edema: str(20),
  descripcion: text(),
  descripcion_sist_genito_urinario: text(),
})

// eval_sintomas_gastroin_nutricion — one-to-many
export const evalSintomasGastroinSchema = z.object({
  presenta_sgi: z.boolean().nullish(),
  presencia: str(50),
})

// ─── Schema principal ────────────────────────────────────────────────────────

export const physicalExaminationSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia debe ser un UUID válido'),
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
  return physicalExaminationSchema.omit({ historia_paciente_id: true }).partial().safeParse(input)
}
