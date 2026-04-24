/**
 * Default values compartidos entre MedicalPatientForm y EvolutionNoteForm.
 * Los nombres de campo coinciden exactamente con los del schema de Prisma.
 */

export const APARATOS_DEFAULTS = {
  neurologico: '',
  cardiovascular: '',
  respiratorio: '',
  hematologico: '',
  digestivo: '',
  musculoesqueletico: '',
  genitourinario: '',
  endocrinologico: '',
  metabolico: '',
  nutricional: '',
}

export const INFORMACION_FISICA_DEFAULTS = {
  peso: '',
  altura: '',
  pa_sistolica: '',
  pa_diastolica: '',
  fc: '',
  fr: '',
  circ_cintura: '',
  circ_cadera: '',
  sp_o2: '',
  glucosa_capilar: '',
  temperatura: '',
  exploracion_fisica: '',
  habito_exterior: '',
}

export const PLAN_ESTUDIO_DEFAULTS = {
  plan_tratamiento: '',
  tratamiento: '',
  estudios_complementarios: '',
  cie10_codes: [],
}
