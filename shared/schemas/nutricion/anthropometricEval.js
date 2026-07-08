import { z } from 'zod'
import { optionalDateSchema, str, num } from '../fields.js'

const bool = () => z.boolean().nullish()

// eval_antro_ad_kid_nutricion: evaluación pediátrica (menores de 18 años)
export const evalAntroKidSchema = z.object({
  percentiles_imc: num({ min: 0, max: 100 }),
  interpretacion_imc: str(255),
  percentiles_cintura: num({ min: 0, max: 100 }),
  percentiles_pb: num({ min: 0, max: 100 }),
  percentiles_pct: num({ min: 0, max: 100 }),
  percentiles_pcse: num({ min: 0, max: 100 }),
  peso_para_talla: num({ min: 0, max: 100 }),
  peso_ideal: num({ min: 0, max: 300 }),
  desviacion_estandar_peso: num({ min: -10, max: 10 }),
  interpretacion_nom_peso: str(50),
  talla_para_edad: num({ min: 0, max: 100 }),
  talla_ideal: num({ min: 0, max: 250 }),
  desviacion_estandar_talla: num({ min: -10, max: 10 }),
  interpretacion_nom_talla: str(50),
  peso_para_edad: num({ min: 0, max: 100 }),
  desviacion_estandar_peso_edad: num({ min: -10, max: 10 }),
  interpretacion_nom_peso_edad: str(50),
  diagnostico_general: str(50),
  resistencia: num({ min: 0, max: 2000 }),
  reactancia: num({ min: 0, max: 2000 }),
  angulo_fase: num({ min: 0, max: 20 }),
  tan_angulo_fase: num({ min: 0, max: 10 }),
})

// eval_antro_ad_adulto_nutricion: evaluación de adulto (18 años en adelante)
export const evalAntroAdultoSchema = z.object({
  codo: num({ min: 0, max: 20 }), // diámetro de codo, cm
  frisancho: num({ min: 0, max: 100 }), // percentil de complexión
  complexion: str(20),
  pi_kg: num({ min: 0, max: 300 }), // peso ideal, kg
  edema_liq: num({ min: 0, max: 50 }), // líquido por edema, L
  peso_sin_edema: num({ min: 0, max: 500 }),
  peso_ajustado: num({ min: 0, max: 500 }),
  peso_ideal_por: num({ min: 0, max: 300 }), // % de peso ideal
  diagnostico_pi: str(20),
  diagnostico_imc: str(20),
  pcb: num({ min: 0, max: 100 }), // pliegue cutáneo bicipital, mm
  pcsi: num({ min: 0, max: 100 }), // pliegue cutáneo suprailiaco, mm
  riesgo_cv: bool(),
  cadera: num({ min: 0, max: 300 }), // cm
  indice_cintura_cadera: num({ min: 0, max: 3 }),
  diagnostico_icc: str(20),
  circuf_cuello: num({ min: 0, max: 100 }), // cm
  riesgo_eo_inf: bool(),
})

export const anthropometricEvalBaseSchema = z.object({
  fecha: optionalDateSchema,
  peso_actual: num({ min: 0, max: 500 }), // kg
  estatura: num({ min: 0, max: 250 }), // cm
  imc: num({ min: 0, max: 100 }),
  pantorrilla: num({ min: 0, max: 100 }), // cm
  cintura: num({ min: 0, max: 300 }), // cm
  pb: num({ min: 0, max: 100 }), // perímetro braquial, cm
  pct: num({ min: 0, max: 100 }), // pliegue cutáneo tricipital, mm
  pcse: num({ min: 0, max: 100 }), // pliegue cutáneo subescapular, mm
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
  (data) => Boolean(data.kid) !== Boolean(data.adulto),
  {
    message:
      'Debe incluir únicamente los datos de evaluación pediátrica (kid) o de adulto (adulto), no ambos',
    path: ['kid'],
  }
)

export function validateAnthropometricEval(input) {
  return anthropometricEvalSchema.safeParse(input)
}

export function validatePartialAnthropometricEval(input) {
  return anthropometricEvalObjectSchema.partial().safeParse(input)
}
