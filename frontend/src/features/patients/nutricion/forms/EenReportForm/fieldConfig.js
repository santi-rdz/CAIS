// Layout de los campos del reporte EEN. Los catálogos (apetito, progreso) viven
// en el constants.js de dominio; aquí solo el orden/labels/placeholders.

// Antropometría de la evaluación (Paso 1). Inputs numéricos.
export const ANTROPOMETRIA_FIELDS = [
  { name: 'peso', label: 'Peso (kg)', step: '0.1', placeholder: 'Ej. 70.5' },
  { name: 'estatura', label: 'Estatura (cm)', step: '0.1', placeholder: 'Ej. 165.5' },
  { name: 'cintura', label: 'Cintura (cm)', step: '0.1', placeholder: 'Ej. 85.5' },
]

// Observaciones del reporte de adulto (Paso 1).
export const ADULTO_OBS_FIELDS = [
  {
    name: 'habitos_ali_obs',
    label: 'Hábitos de alimentación / Estilo de vida',
    placeholder: 'Describe los hábitos alimenticios y estilo de vida del paciente...',
  },
  {
    name: 'alteraciones_gastroin',
    label: 'Alteraciones gastrointestinales',
    placeholder: 'Describe cualquier alteración gastrointestinal observada...',
  },
]

// Observaciones del reporte pediátrico (Paso 1). solicito_orient (booleano) se
// renderiza aparte como select Sí/No.
export const KID_OBS_FIELDS = [
  {
    name: 'eval_diag_edo_nutr',
    label: 'Evaluación y diagnóstico del estado de nutrición',
    placeholder: 'Describe la evaluación y el diagnóstico del estado nutricional...',
  },
  {
    name: 'prescrip_nut_obs',
    label: 'Prescripción nutricional',
    placeholder: 'Observaciones de la prescripción nutricional...',
  },
  {
    name: 'educ_nut_obs',
    label: 'Educación nutricional',
    placeholder: 'Observaciones de la educación nutricional del paciente...',
  },
  {
    name: 'consejeria_nut_obs',
    label: 'Consejería nutricional',
    placeholder: 'Observaciones de la consejería nutricional...',
  },
  {
    name: 'coord_aten_nut_obs',
    label: 'Coordinación de la atención nutricional',
    placeholder: 'Observaciones de la coordinación de la atención nutricional...',
  },
]

export const SOLICITO_ORIENT_OPTIONS = [
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
]

export const MAX_DIAGNOSTICOS = 50

export const emptyDiagnostico = () => ({
  pes: '',
  intervencion: '',
  objetivos: '',
  indicadores: '',
  criterio: '',
  progreso: '',
})
