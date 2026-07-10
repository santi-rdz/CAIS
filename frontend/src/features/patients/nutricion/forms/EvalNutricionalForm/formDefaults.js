import {
  FRECUENCIA_FIELD_NAMES,
  HORARIO_TIME_FIELDS,
  HORARIO_BOOL_FIELDS,
} from '@features/patients/nutricion/forms/EvalNutricionalForm/fieldConfig'
import { APETITO_SCORE_FIELDS } from '@features/patients/nutricion/constants'

const emptyStrings = (names) => Object.fromEntries(names.map((n) => [n, '']))
const nulls = (names) => Object.fromEntries(names.map((n) => [n, null]))

export const APETITO_DEFAULTS = emptyStrings(APETITO_SCORE_FIELDS.map((f) => f.name))

export const FRECUENCIA_DEFAULTS = emptyStrings(FRECUENCIA_FIELD_NAMES)

// Horas → null (input vacío); tipo/pensamientos → ''; booleanos → null.
export const HORARIOS_DEFAULTS = {
  ...nulls(HORARIO_TIME_FIELDS.map((f) => f.name)),
  tipo_alimentacion: '',
  pensamientos_sobre_dieta: '',
  ...nulls(HORARIO_BOOL_FIELDS.map((f) => f.name)),
}

export const BASE_DEFAULTS = {
  sigue_dieta: null,
  tiene_alergia: null,
  cual_alergia: '',
  alimentos_disgusta: '',
}

export const NUTRICIONAL_DEFAULTS = {
  ...BASE_DEFAULTS,
  eval_apetito_nutricion: APETITO_DEFAULTS,
  frec_consumo_alimentos_nutricion: FRECUENCIA_DEFAULTS,
  horarios_comida_nutricion: HORARIOS_DEFAULTS,
}
