import dayjs from 'dayjs'
import { computeApetitoScore, APETITO_SCORE_FIELDS } from '@features/patients/nutricion/constants'
import { HORARIO_TIME_FIELDS } from '@features/patients/nutricion/forms/EvalNutricionalForm/fieldConfig'

const TIME_NAMES = HORARIO_TIME_FIELDS.map((f) => f.name)

// dayjs (del TimePicker) → 'HH:mm' para la DB (VarChar). Acepta también un
// string ya formateado (por si el valor no se tocó en edición).
function toTimeString(v) {
  if (v && dayjs.isDayjs(v) && v.isValid()) return v.format('HH:mm')
  if (typeof v === 'string' && v.trim()) return v.trim()
  return null
}

// 'HH:mm' de la DB → dayjs para el TimePicker en modo edición.
export function parseTimeToDayjs(v) {
  if (!v || typeof v !== 'string' || !v.includes(':')) return null
  const [hh, mm] = v.split(':')
  const d = dayjs().hour(Number(hh)).minute(Number(mm)).second(0)
  return d.isValid() ? d : null
}

// Convierte las horas del grupo a string; el resto de campos pasa tal cual
// (los limpia omitEmpty/nullifyEmpty en el caller).
export function serializeHorarios(h) {
  if (!h) return null
  const out = { ...h }
  for (const name of TIME_NAMES) out[name] = toTimeString(h[name])
  return out
}

// Devuelve los 4 selects + puntaje/clasificación derivados.
export function serializeApetito(a) {
  if (!a) return null
  const { puntaje, clasif } = computeApetitoScore(a)
  const out = {}
  for (const { name } of APETITO_SCORE_FIELDS) out[name] = a[name]
  out.puntaje_total = puntaje
  out.clasif_alteracion_apetito = clasif
  return out
}

export function apetitoHasValues(a) {
  return computeApetitoScore(a).hasValues
}
