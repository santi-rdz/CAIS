import dayjs from 'dayjs'
import { fillDefaults } from '@lib/utils'
import {
  ANTRO_BASE_DEFAULTS,
  ANTRO_ADULTO_DEFAULTS,
  ANTRO_KID_DEFAULTS,
} from '@features/patients/nutricion/forms/AntropometricaForm/formDefaults'

export function toNum(v) {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function round(n, decimals = 2) {
  if (n == null || !Number.isFinite(n)) return null
  const f = 10 ** decimals
  return Math.round(n * f) / f
}

function parseBool(v) {
  if (v === 'true' || v === true) return true
  if (v === 'false' || v === false) return false
  return null
}

function boolToField(v) {
  if (v === true) return 'true'
  if (v === false) return 'false'
  return ''
}

// Fórmulas tomadas de la hoja de cálculo clínica: el IMC y el % de peso ideal
// usan el peso SIN edema, no el peso actual.
export function computeEstaturaM(estatura) {
  const cm = toNum(estatura)
  return cm ? round(cm / 100, 2) : null
}

export function computePesoSinEdema(pesoActual, edemaLiq) {
  const peso = toNum(pesoActual)
  if (peso == null) return null
  return round(peso - (toNum(edemaLiq) ?? 0), 2)
}

export function computeImc(peso, estatura) {
  const p = toNum(peso)
  const m = computeEstaturaM(estatura)
  if (p == null || !m) return null
  return round(p / (m * m), 1)
}

// En adulto el IMC se calcula con el peso SIN edema (no el peso actual).
export function computeImcAdulto(pesoActual, edemaLiq, estatura) {
  return computeImc(computePesoSinEdema(pesoActual, edemaLiq), estatura)
}

export function computePesoIdealPor(pesoSinEdema, piKg) {
  const pi = toNum(piKg)
  if (pesoSinEdema == null || !pi) return null
  return round((pesoSinEdema * 100) / pi, 1)
}

export function computeIcc(cintura, cadera) {
  const c = toNum(cintura)
  const h = toNum(cadera)
  if (c == null || !h) return null
  return round(c / h, 2)
}

// Bioimpedancia: tangente = reactancia/resistencia; ángulo de fase en grados.
export function computeVector(resistencia, reactancia) {
  const r = toNum(resistencia)
  const x = toNum(reactancia)
  if (!r || x == null) return { angulo_fase: null, tan_angulo_fase: null }
  const tan = x / r
  return {
    angulo_fase: round(Math.atan(tan) * (180 / Math.PI), 2),
    tan_angulo_fase: round(tan, 4),
  }
}

function buildBase(data) {
  return {
    peso_actual: toNum(data.peso_actual),
    estatura: toNum(data.estatura),
    pantorrilla: toNum(data.pantorrilla),
    cintura: toNum(data.cintura),
    pb: toNum(data.pb),
    pct: toNum(data.pct),
    pcse: toNum(data.pcse),
  }
}

function buildAdulto(data) {
  const a = data.adulto ?? {}
  const pesoSinEdema = computePesoSinEdema(data.peso_actual, a.edema_liq)
  return {
    codo: toNum(a.codo),
    frisancho: toNum(a.frisancho),
    complexion: a.complexion || null,
    pi_kg: toNum(a.pi_kg),
    edema_liq: toNum(a.edema_liq),
    peso_sin_edema: pesoSinEdema,
    peso_ajustado: toNum(a.peso_ajustado),
    peso_ideal_por: computePesoIdealPor(pesoSinEdema, a.pi_kg),
    diagnostico_pi: a.diagnostico_pi || null,
    diagnostico_imc: a.diagnostico_imc || null,
    pcb: toNum(a.pcb),
    pcsi: toNum(a.pcsi),
    riesgo_cv: parseBool(a.riesgo_cv),
    cadera: toNum(a.cadera),
    indice_cintura_cadera: computeIcc(data.cintura, a.cadera),
    diagnostico_icc: a.diagnostico_icc || null,
    circuf_cuello: toNum(a.circuf_cuello),
    riesgo_eo_inf: parseBool(a.riesgo_eo_inf),
  }
}

function buildKid(data) {
  const k = data.kid ?? {}
  return {
    percentiles_imc: toNum(k.percentiles_imc),
    interpretacion_imc: k.interpretacion_imc || null,
    percentiles_cintura: toNum(k.percentiles_cintura),
    percentiles_pb: toNum(k.percentiles_pb),
    percentiles_pct: toNum(k.percentiles_pct),
    percentiles_pcse: toNum(k.percentiles_pcse),
    peso_para_talla: toNum(k.peso_para_talla),
    peso_ideal: toNum(k.peso_ideal),
    desviacion_estandar_peso: toNum(k.desviacion_estandar_peso),
    interpretacion_nom_peso: k.interpretacion_nom_peso || null,
    talla_para_edad: toNum(k.talla_para_edad),
    talla_ideal: toNum(k.talla_ideal),
    desviacion_estandar_talla: toNum(k.desviacion_estandar_talla),
    interpretacion_nom_talla: k.interpretacion_nom_talla || null,
    peso_para_edad: toNum(k.peso_para_edad),
    desviacion_estandar_peso_edad: toNum(k.desviacion_estandar_peso_edad),
    interpretacion_nom_peso_edad: k.interpretacion_nom_peso_edad || null,
    diagnostico_general: k.diagnostico_general || null,
    resistencia: toNum(k.resistencia),
    reactancia: toNum(k.reactancia),
    ...computeVector(k.resistencia, k.reactancia),
  }
}

export function buildAntroPayload(data, { esAdulto, historiaId }) {
  const base = buildBase(data)
  const imc = esAdulto
    ? computeImcAdulto(data.peso_actual, data.adulto?.edema_liq, data.estatura)
    : computeImc(data.peso_actual, data.estatura)

  return {
    historia_paciente_id: historiaId,
    ...base,
    imc,
    ...(esAdulto ? { adulto: buildAdulto(data) } : { kid: buildKid(data) }),
  }
}

export function buildEditDefaults(record, esAdulto) {
  const base = fillDefaults(ANTRO_BASE_DEFAULTS, record)
  const fecha = record?.fecha ? dayjs(record.fecha) : dayjs()

  if (esAdulto) {
    const a = record?.eval_antro_ad_adulto_nutricion ?? {}
    return {
      ...base,
      fecha,
      adulto: {
        ...fillDefaults(ANTRO_ADULTO_DEFAULTS, a),
        riesgo_cv: boolToField(a.riesgo_cv),
        riesgo_eo_inf: boolToField(a.riesgo_eo_inf),
      },
    }
  }

  const k = record?.eval_antro_ad_kid_nutricion ?? {}
  return { ...base, fecha, kid: fillDefaults(ANTRO_KID_DEFAULTS, k) }
}
