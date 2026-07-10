import {
  PESO_FIELDS,
  SIGNOS_NUM_FIELDS,
  ANTROPOMETRICO_FIELDS,
  DIAGNOSTICO_FIELDS,
} from '@features/patients/nutricion/forms/ExamFisicoForm/fieldConfig'

const emptyStrings = (names) => Object.fromEntries(names.map((n) => [n, '']))

const SEMIOLOGIA_SELECT_NAMES = [
  ...ANTROPOMETRICO_FIELDS.map((f) => f.name),
  ...DIAGNOSTICO_FIELDS.map((f) => f.name),
]

// eval_perdida_peso: solo los 2 campos capturados; el % se deriva al enviar.
export const PESO_DEFAULTS = emptyStrings(PESO_FIELDS.map((f) => f.name))

export const SIGNOS_DEFAULTS = {
  ...emptyStrings(SIGNOS_NUM_FIELDS.map((f) => f.name)),
  dificultad_respiratoria: null,
}

export const SEMIOLOGIA_DEFAULTS = {
  ...emptyStrings(SEMIOLOGIA_SELECT_NAMES),
  descripcion: '',
  descripcion_sist_genito_urinario: '',
}

// presenta_sgi + sintomas son auxiliares del form (no son columnas): se
// serializan a la relación eval_sintomas_gastroin al enviar.
export const EXAM_FISICO_DEFAULTS = {
  eval_perdida_peso: PESO_DEFAULTS,
  presenta_sgi: null,
  sintomas: [],
  signos_vitales: SIGNOS_DEFAULTS,
  semiologia: SEMIOLOGIA_DEFAULTS,
}
