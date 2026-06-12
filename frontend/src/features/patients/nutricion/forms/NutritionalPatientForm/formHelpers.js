import dayjs from 'dayjs'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import { omitEmpty, nullifyEmpty } from '@lib/utils'
import { DEFAULT_VALUES } from '@features/patients/nutricion/forms/NutritionalPatientForm/formConfig'

// Grupos de adicciones: [campo activo, campo frecuencia, campo métrica].
const ADICCION_GROUPS = [
  ['adicto_tabaco', 'tabaco_frecuencia', 'num_cigarros_d'],
  ['adicto_alcohol', 'alcohol_frecuencia', 'ml_ocasion'],
  ['adicto_droga', 'drogas_frecuencia', 'cual_droga'],
  ['adicto_med_contr', 'med_contr_frecuencia', 'cual_med_contr'],
]

const hasValue = (v) => v != null && v !== ''

// Conserva las filas no marcadas como borradas (_deleted, flag solo-UI) y con
// algún dato; devuelve cada fila reducida a sus columnas reales (sin _deleted).
function cleanRows(rows, keys) {
  return (rows ?? [])
    .filter((row) => !row?._deleted && keys.some((k) => hasValue(row?.[k])))
    .map((row) => Object.fromEntries(keys.map((k) => [k, row?.[k]])))
}

// Hay adicción si al menos un grupo está marcado como 'si'.
function hasAnyAdiccion(adicciones) {
  return ADICCION_GROUPS.some(([activo]) => adicciones?.[activo] === 'si')
}

// Aplana adicciones a su shape plano. Siempre emite frecuencia y métrica (null
// cuando el grupo está en 'no' o vacío) para que, al editar, pasar un grupo a
// 'no' limpie esos campos en la DB en vez de dejarlos stale.
function buildAdicciones(adicciones) {
  const out = {}
  for (const [activo, frecuencia, metrica] of ADICCION_GROUPS) {
    const isActive = adicciones?.[activo] === 'si'
    out[activo] = isActive ? 'si' : 'no'
    out[frecuencia] = isActive && hasValue(adicciones[frecuencia]) ? adicciones[frecuencia] : null
    out[metrica] = isActive && hasValue(adicciones[metrica]) ? adicciones[metrica] : null
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

// ─── Edición: dirty fields → payload de update ────────────────────────────────

const PATIENT_KEYS = new Set(Object.keys(patientSchema.shape))
// Flags solo-UI (no son columnas) que nunca viajan al backend.
const UI_FLAGS = new Set(['presenta_enfermedad', 'presenta_tratamiento'])

// Separa los campos modificados en paciente vs historia. Si cambia cualquier
// fila de una relación one-to-many, se envía la sección completa para que el
// backend la reemplace/borre; esto mantiene correcto el borrado de filas, con
// el tradeoff de más payload y potencial overwrites si hubiera edición
// concurrente sobre la misma historia. Los escalares vacíos → null.
export function splitDirtyData(dirty, fullData) {
  const dirtyPatient = {}
  const dirtyHistory = {}

  for (const key of Object.keys(dirty)) {
    if (UI_FLAGS.has(key)) continue
    if (PATIENT_KEYS.has(key)) dirtyPatient[key] = dirty[key]
    else dirtyHistory[key] = dirty[key]
  }

  if ('historias_medicas_nutricion' in dirtyHistory) {
    dirtyHistory.historias_medicas_nutricion = cleanRows(
      fullData.historias_medicas_nutricion,
      ENFERMEDAD_ROW_KEYS
    )
  }
  if ('tratamiento_alt_nutricion' in dirtyHistory) {
    dirtyHistory.tratamiento_alt_nutricion = cleanRows(
      fullData.tratamiento_alt_nutricion,
      TRATAMIENTO_ROW_KEYS
    )
  }
  if ('adicciones' in dirtyHistory) {
    dirtyHistory.adicciones = buildAdicciones(fullData.adicciones)
  }

  return {
    patientData: Object.keys(dirtyPatient).length ? nullifyEmpty(dirtyPatient) : null,
    historyData: Object.keys(dirtyHistory).length ? nullifyEmpty(dirtyHistory) : null,
  }
}

// ─── Edit/clone: form data ← (paciente, historia) ─────────────────────────────

const ENFERMEDAD_ROW_KEYS = ['enfermedad', 'evol', 'farmacos', 'dosis']
const TRATAMIENTO_ROW_KEYS = ['producto', 'cual_producto', 'mejora', 'dosis']

// Mapea filas de la DB al shape exacto del field array (null → '' para inputs
// controlados, descartando ids y FKs que el form no maneja). _deleted arranca en
// false (flag solo-UI para el borrado con restauración).
function mapRows(rows, keys) {
  return (rows ?? []).map((row) => ({
    ...Object.fromEntries(keys.map((k) => [k, row?.[k] ?? ''])),
    _deleted: false,
  }))
}

// Reconstruye el objeto adicciones del form desde la historia: los flags
// adicto_* caen a 'no' y el resto de campos vacíos a '' (inputs controlados).
function buildAdiccionesDefaults(adicciones) {
  const base = DEFAULT_VALUES.adicciones
  if (!adicciones) return { ...base }
  const out = {}
  for (const key of Object.keys(base)) {
    const value = adicciones[key]
    out[key] = key.startsWith('adicto_') ? (value === 'si' ? 'si' : 'no') : (value ?? '')
  }
  return out
}

// Construye los defaults del form en modo edición. En patientOnly solo importa
// el paciente (+ motivo de la historia más reciente); las relaciones clínicas se
// editan desde "Editar historia", así que quedan vacías.
export function buildEditDefaults(patient, historia, { patientOnly = false } = {}) {
  const enfermedades = patientOnly
    ? []
    : mapRows(historia.historias_medicas_nutricion, ENFERMEDAD_ROW_KEYS)
  const tratamientos = patientOnly
    ? []
    : mapRows(historia.tratamiento_alt_nutricion, TRATAMIENTO_ROW_KEYS)

  const patientFields = {}
  for (const key of Object.keys(DEFAULT_VALUES)) {
    if (key in patient) patientFields[key] = patient[key] ?? DEFAULT_VALUES[key]
  }
  const parsedFechaNacimiento = patient.fecha_nacimiento ? dayjs(patient.fecha_nacimiento) : null

  return {
    ...DEFAULT_VALUES,
    ...patientFields,
    fecha_nacimiento: parsedFechaNacimiento?.isValid() ? parsedFechaNacimiento : null,
    motivo_consulta: historia.motivo_consulta ?? '',
    presenta_enfermedad: enfermedades.length ? 'si' : 'no',
    historias_medicas_nutricion: enfermedades,
    presenta_tratamiento: tratamientos.length ? 'si' : 'no',
    tratamiento_alt_nutricion: tratamientos,
    adicciones: patientOnly
      ? { ...DEFAULT_VALUES.adicciones }
      : buildAdiccionesDefaults(historia.adicciones),
  }
}

// Payload de update al editar una historia (historiaOnly): reconstruye las 3
// secciones clínicas completas desde el form para que el backend las reemplace.
// No dependemos de dirtyFields porque RHF no reporta de forma granular el remove
// de un field array — así, vaciar una sección sí la borra.
export function buildHistoryUpdate(data) {
  return {
    historias_medicas_nutricion: cleanRows(data.historias_medicas_nutricion, ENFERMEDAD_ROW_KEYS),
    tratamiento_alt_nutricion: cleanRows(data.tratamiento_alt_nutricion, TRATAMIENTO_ROW_KEYS),
    adicciones: buildAdicciones(data.adicciones),
  }
}
