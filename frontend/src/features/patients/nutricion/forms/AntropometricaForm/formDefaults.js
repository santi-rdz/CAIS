// Campos base (comunes a niño y adulto). `imc` no se edita: se auto-calcula.
export const ANTRO_BASE_DEFAULTS = {
  peso_actual: '',
  estatura: '',
  pantorrilla: '',
  cintura: '',
  pb: '',
  pct: '',
  pcse: '',
}

// Adulto: los auto-calculados (peso sin edema, % peso ideal, ICC) no van aquí;
// se derivan al enviar. `riesgo_cv`/`riesgo_eo_inf` son strings del Select.
export const ANTRO_ADULTO_DEFAULTS = {
  codo: '',
  frisancho: '',
  complexion: '',
  pi_kg: '',
  edema_liq: '',
  peso_ajustado: '',
  diagnostico_pi: '',
  diagnostico_imc: '',
  pcb: '',
  pcsi: '',
  riesgo_cv: '',
  cadera: '',
  diagnostico_icc: '',
  circuf_cuello: '',
  riesgo_eo_inf: '',
}

// Niño: ángulo de fase y tangente no van aquí; se derivan de resistencia/reactancia.
export const ANTRO_KID_DEFAULTS = {
  percentiles_imc: '',
  interpretacion_imc: '',
  percentiles_cintura: '',
  percentiles_pb: '',
  percentiles_pct: '',
  percentiles_pcse: '',
  peso_para_talla: '',
  peso_ideal: '',
  desviacion_estandar_peso: '',
  interpretacion_nom_peso: '',
  talla_para_edad: '',
  talla_ideal: '',
  desviacion_estandar_talla: '',
  interpretacion_nom_talla: '',
  peso_para_edad: '',
  desviacion_estandar_peso_edad: '',
  interpretacion_nom_peso_edad: '',
  diagnostico_general: '',
  resistencia: '',
  reactancia: '',
}
