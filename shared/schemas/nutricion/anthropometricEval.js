import { z } from 'zod'
import { optionalDateSchema, str } from '../fields.js'

const num = () => z.number().nullish()
const bool = () => z.boolean().nullish()

// eval_antro_ad_kid_nutricion: evaluación pediátrica (menores de 18 años)
export const evalAntroKidSchema = z.object({
  percentiles_imc: num(),
  interpretacion_imc: str(255),
  percentiles_cintura: num(),
  percentiles_pb: num(),
  percentiles_pct: num(),
  percentiles_pcse: num(),
  peso_para_talla: num(),
  peso_ideal: num(),
  desviacion_estandar_peso: num(),
  interpretacion_nom_peso: str(50),
  talla_para_edad: num(),
  talla_ideal: num(),
  desviacion_estandar_talla: num(),
  interpretacion_nom_talla: str(50),
  peso_para_edad: num(),
  desviacion_estandar_peso_edad: num(),
  interpretacion_nom_peso_edad: str(50),
  diagnostico_general: str(50),
  resistencia: num(),
  reactancia: num(),
  angulo_fase: num(),
  tan_angulo_fase: num(),
})

// eval_antro_ad_adulto_nutricion: evaluación de adulto (18 años en adelante)
export const evalAntroAdultoSchema = z.object({
  codo: num(),
  frisancho: num(),
  complexion: str(20),
  pi_kg: num(),
  edema_liq: num(),
  peso_sin_edema: num(),
  peso_ajustado: num(),
  peso_ideal_por: num(),
  diagnostico_pi: str(20),
  diagnostico_imc: str(20),
  pcb: num(),
  pcsi: num(),
  riesgo_cv: bool(),
  cadera: num(),
  indice_cintura_cadera: num(),
  diagnostico_icc: str(20),
  circuf_cuello: num(),
  riesgo_eo_inf: bool(),
})

export const anthropometricEvalBaseSchema = z.object({
  fecha: optionalDateSchema,
  peso_actual: num(),
  estatura: num(),
  imc: num(),
  pantorrilla: num(),
  cintura: num(),
  pb: num(),
  pct: num(),
  pcse: num(),
})

// Schema base sin refine, usado también para el update parcial
const anthropometricEvalObjectSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia del paciente debe ser un UUID válido'),
  ...anthropometricEvalBaseSchema.shape,
  // Solo uno de los dos debe enviarse; el modelo decide cuál corresponde
  // según la edad del paciente (>=18 años => adulto, si no => kid).
  kid: evalAntroKidSchema.optional(),
  adulto: evalAntroAdultoSchema.optional(),
})

export const anthropometricEvalSchema = anthropometricEvalObjectSchema.refine(
  (data) => Boolean(data.kid) || Boolean(data.adulto),
  {
    message: 'Debe incluir los datos de evaluación pediátrica (kid) o de adulto (adulto)',
    path: ['kid'],
  }
)

export function validateAnthropometricEval(input) {
  return anthropometricEvalSchema.safeParse(input)
}

export function validatePartialAnthropometricEval(input) {
  return anthropometricEvalObjectSchema.partial().safeParse(input)
}
