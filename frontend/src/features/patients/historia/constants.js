export const PERIODOS = [
  { value: '2026-2031', label: '2026–2031 (actual)' },
  { value: '2021-2026', label: '2021–2026' },
  { value: '2016-2021', label: '2016–2021' },
]

export const SECCIONES = [
  { id: 'consulta', label: 'Consulta' },
  { id: 'signos', label: 'Signos vitales' },
  { id: 'ant-patologicos', label: 'Ant. patológicos' },
  { id: 'ant-familiares', label: 'Ant. familiares' },
  { id: 'aparatos', label: 'Aparatos y sistemas' },
  { id: 'inmunizaciones', label: 'Inmunizaciones' },
  { id: 'plan', label: 'Plan de estudio' },
  { id: 'servicios', label: 'Servicios' },
]

export function buildAntPatFields(ap) {
  if (!ap) return null
  return [
    { label: 'Crónico-degenerativos', value: ap.cronico_degenerativos },
    { label: 'Quirúrgicos', value: ap.quirurgicos },
    { label: 'Hospitalizaciones', value: ap.hospitalizaciones },
    { label: 'Traumáticos', value: ap.traumaticos },
    { label: 'Transfusionales', value: ap.transfusionales },
    { label: 'Trasplantes', value: ap.transplantes },
    { label: 'Alérgicos', value: ap.alergicos },
    { label: 'Infectocontagiosos', value: ap.infectocontagiosos },
    { label: 'Toxicomanías', value: ap.toxicomanias },
    { label: 'COVID-19', value: ap.covid_19 },
    { label: 'Psicología / Psiquiatría', value: ap.psicologia_psiquiatria },
    { label: 'GYO', value: ap.gyo },
    { label: 'Enfs. congénitas', value: ap.enfermedades_congenitas },
    { label: 'Enfs. de la infancia', value: ap.enfermedades_infancia },
  ]
}

export function buildAntFamFields(af) {
  if (!af) return null
  return [
    { label: 'Padre', value: af.padre },
    { label: 'Madre', value: af.madre },
    { label: 'Abuelo paterno', value: af.abuelo_paterno },
    { label: 'Abuelo materno', value: af.abuelo_materno },
    { label: 'Abuela paterna', value: af.abuela_paterna },
    { label: 'Abuela materna', value: af.abuela_materna },
    { label: 'Otros', value: af.otros },
  ]
}

export function buildAparSistFields(as_) {
  if (!as_) return null
  return [
    { label: 'Neurológico', value: as_.neurologico },
    { label: 'Cardiovascular', value: as_.cardiovascular },
    { label: 'Respiratorio', value: as_.respiratorio },
    { label: 'Hematológico', value: as_.hematologico },
    { label: 'Digestivo', value: as_.digestivo },
    { label: 'Musculoesquelético', value: as_.musculoesqueletico },
    { label: 'Genitourinario', value: as_.genitourinario },
    { label: 'Endocrinológico', value: as_.endocrinologico },
    { label: 'Metabólico', value: as_.metabolico },
    { label: 'Nutricional', value: as_.nutricional },
  ]
}
