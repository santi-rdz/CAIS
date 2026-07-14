export const TPAN_TEXT_FIELDS = [
  'eval_realizada',
  'observacion',
  'estandares_com',
  'decision',
  'problema_iden',
  'causa_probl',
  'evidencia_probl',
]

export function pickTpanText(data) {
  return Object.fromEntries(TPAN_TEXT_FIELDS.map((f) => [f, data[f]]))
}

// El Select entrega el progreso como string; '' significa sin seleccionar.
export function parseProgreso(value) {
  return value === '' || value == null ? undefined : Number(value)
}

// El detalle llega con progreso como número (o null); el Select lo consume como
// string.
export function progresoToField(value) {
  return value == null ? '' : String(value)
}
