import { omitEmpty } from '@lib/utils'

// Grupos de adicciones: [campo activo, campo frecuencia, campo métrica].
const ADICCION_GROUPS = [
  ['adicto_tabaco', 'tabaco_frecuencia', 'num_cigarros_d'],
  ['adicto_alcohol', 'alcohol_frecuencia', 'ml_ocasion'],
  ['adicto_droga', 'drogas_frecuencia', 'cual_droga'],
  ['adicto_med_contr', 'med_contr_frecuencia', 'cual_med_contr'],
]

const hasValue = (v) => v != null && v !== ''

// Conserva solo las filas con algún dato relevante (descarta filas vacías).
function cleanRows(rows, keys) {
  return (rows ?? []).filter((row) => keys.some((k) => hasValue(row?.[k])))
}

// Hay adicción si al menos un grupo está marcado como 'si'.
function hasAnyAdiccion(adicciones) {
  return ADICCION_GROUPS.some(([activo]) => adicciones?.[activo] === 'si')
}

// Aplana adicciones: para los grupos inactivos solo guarda el flag; para los
// activos conserva frecuencia y métrica (null si vacías).
function buildAdicciones(adicciones) {
  const out = {}
  for (const [activo, frecuencia, metrica] of ADICCION_GROUPS) {
    out[activo] = adicciones?.[activo] ?? 'no'
    if (adicciones?.[activo] === 'si') {
      out[frecuencia] = hasValue(adicciones[frecuencia]) ? adicciones[frecuencia] : null
      out[metrica] = hasValue(adicciones[metrica]) ? adicciones[metrica] : null
    }
  }
  return out
}

// Keys que NO pertenecen al paciente: campos de la historia + flags solo-UI.
const HISTORY_KEYS = new Set([
  'historias_medicas_nutricion',
  'tratamiento_alt_nutricion',
  'adicciones',
  'fecha_ingreso',
  'motivo_consulta',
  'presenta_enfermedad',
  'presenta_tratamiento',
])

// Divide el form data en lo que pertenece al paciente vs la historia de
// nutrición. Los flags presenta_* son solo-UI y se descartan.
export function splitFormData(rawData) {
  const patientFields = {}
  for (const [key, value] of Object.entries(rawData)) {
    if (!HISTORY_KEYS.has(key)) patientFields[key] = value
  }
  const patientData = omitEmpty(patientFields)

  const enfermedades = cleanRows(rawData.historias_medicas_nutricion, [
    'enfermedad',
    'evol',
    'farmacos',
    'dosis',
  ])
  const tratamientos = cleanRows(rawData.tratamiento_alt_nutricion, [
    'producto',
    'cual_producto',
    'mejora',
    'dosis',
  ])

  const historyData = {
    ...(rawData.fecha_ingreso && { fecha_ingreso: rawData.fecha_ingreso }),
    ...(rawData.motivo_consulta && { motivo_consulta: rawData.motivo_consulta }),
    ...(enfermedades.length && { historias_medicas_nutricion: enfermedades }),
    ...(tratamientos.length && { tratamiento_alt_nutricion: tratamientos }),
    ...(hasAnyAdiccion(rawData.adicciones) && {
      adicciones: buildAdicciones(rawData.adicciones),
    }),
  }

  return { patientData, historyData }
}
