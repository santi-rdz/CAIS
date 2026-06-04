export function buildAntPatFields(ap) {
  ap ??= {}
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
  af ??= {}
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
  as_ ??= {}
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
