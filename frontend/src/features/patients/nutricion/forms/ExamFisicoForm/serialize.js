import { computePesoLoss } from '@features/patients/nutricion/constants'

// eval_perdida_peso con el % derivado (redondeado a 2 decimales, Float en DB).
// El caller lo limpia con omitEmpty (create) o nullifyEmpty (update).
export function buildPeso(peso) {
  const { porcentaje } = computePesoLoss(peso)
  return {
    peso_habitual: peso?.peso_habitual,
    peso_perdido: peso?.peso_perdido,
    porcentaje_peso_perdido: porcentaje != null ? Math.round(porcentaje * 100) / 100 : null,
  }
}

// Aux (presenta_sgi + lista de síntomas) → filas de eval_sintomas_gastroin.
// - Sí + síntomas: una fila por síntoma (presenta_sgi=true, presencia=síntoma).
// - No: una sola fila que registra explícitamente la ausencia.
// - Sin contestar: null (se omite del payload).
export function serializeSintomas({ presenta_sgi, sintomas } = {}) {
  if (presenta_sgi === true) {
    const lista = (sintomas ?? []).filter(Boolean)
    return lista.map((s) => ({ presenta_sgi: true, presencia: s }))
  }
  if (presenta_sgi === false) return [{ presenta_sgi: false, presencia: null }]
  return null
}

// eval_sintomas_gastroin (filas de la DB) → aux del form para edición.
export function parseSintomas(filas) {
  if (!filas?.length) return { presenta_sgi: null, sintomas: [] }
  if (filas.some((f) => f.presenta_sgi === false && !f.presencia)) {
    return { presenta_sgi: false, sintomas: [] }
  }
  return {
    presenta_sgi: true,
    sintomas: filas.map((f) => f.presencia).filter(Boolean),
  }
}
