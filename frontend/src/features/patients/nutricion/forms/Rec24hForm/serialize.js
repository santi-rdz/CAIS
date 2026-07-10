import { REC24H_NUTRIENTES } from '@features/patients/nutricion/constants'

const NUTRIENT_KEYS = REC24H_NUTRIENTES.map((n) => n.key)
const OBJETIVO_NAMES = REC24H_NUTRIENTES.map((n) => n.objName)
const COMIDA_TEXT_FIELDS = ['comida', 'grupo', 'alimento']

const isNum = (v) => {
  if (v == null || (typeof v === 'string' && v.trim() === '')) return false
  return Number.isFinite(Number(v))
}

// Solo los 8 objetivos (obj_*) como objeto plano; el caller lo limpia con
// omitEmpty (create) o nullifyEmpty (update).
export function pickObjectives(data) {
  return Object.fromEntries(OBJETIVO_NAMES.map((name) => [name, data[name]]))
}

// Lista de alimentos del form → payload: descarta campos vacíos y castea los
// nutrientes a número. La `fecha` de cada alimento se deriva de la fecha actual
// del recordatorio (recall de un mismo día), no de la que tenía al agregarlo.
export function serializeFoods(comidas = [], fecha) {
  return comidas.map((c) => {
    const out = {}
    if (fecha) out.fecha = fecha
    for (const f of COMIDA_TEXT_FIELDS) {
      if (c[f] != null && c[f] !== '') out[f] = c[f]
    }
    for (const k of NUTRIENT_KEYS) {
      if (isNum(c[k])) out[k] = Number(c[k])
    }
    return out
  })
}

// Filas rec_24h_comidas de la DB → shape que administra AlimentoField (la fecha
// no se administra aquí: se deriva de fecha_eval al serializar).
export function parseFoods(rows = []) {
  return rows.map((r) => {
    const out = {
      comida: r.comida ?? '',
      grupo: r.grupo ?? '',
      alimento: r.alimento ?? '',
    }
    for (const k of NUTRIENT_KEYS) {
      out[k] = r[k] ?? ''
    }
    return out
  })
}

// Objetivos de la fila padre → defaults del form (solo las columnas obj_*).
export function pickObjectivesFromRow(rec = {}) {
  return Object.fromEntries(OBJETIVO_NAMES.map((name) => [name, rec[name] ?? '']))
}
