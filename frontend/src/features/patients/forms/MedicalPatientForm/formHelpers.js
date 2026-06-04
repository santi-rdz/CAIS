import dayjs from 'dayjs'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import { omitEmpty, nullifyEmpty } from '@lib/utils'
import { DEFAULT_VALUES } from '@features/patients/forms/MedicalPatientForm/formConfig'

const PATIENT_KEYS = new Set(Object.keys(patientSchema.shape))

export const HISTORY_NESTED_KEYS = new Set([
  'antecedentes_familiares',
  'antecedentes_patologicos',
  'antecedentes_no_patologicos',
  'servicios',
  'inmunizaciones',
  'aparatos_sistemas',
  'informacion_fisica',
  'planes_estudio',
])

// Divide el form data en lo que pertenece al paciente vs lo que pertenece a la
// historia médica. Drops keys vacías para evitar enviar updates basura.
export function splitFormData(rawData) {
  const data = omitEmpty(rawData)
  const {
    antecedentes_familiares,
    antecedentes_patologicos,
    antecedentes_no_patologicos,
    servicios,
    inmunizaciones,
    aparatos_sistemas,
    informacion_fisica,
    planes_estudio,
    creado_at,
    motivo_consulta,
    historia_enfermedad_actual,
    tipo_sangre,
    vacunas_infancia_completas,
    ...patientFields
  } = data

  const patientData = { ...patientFields }

  const historyData = {
    ...(creado_at && { creado_at }),
    ...(tipo_sangre && { tipo_sangre }),
    ...(vacunas_infancia_completas != null && { vacunas_infancia_completas }),
    ...(motivo_consulta && { motivo_consulta }),
    ...(historia_enfermedad_actual && { historia_enfermedad_actual }),
    ...(antecedentes_familiares && { antecedentes_familiares }),
    ...(antecedentes_patologicos && { antecedentes_patologicos }),
    ...(antecedentes_no_patologicos && { antecedentes_no_patologicos }),
    ...(servicios && { servicios }),
    ...(inmunizaciones && { inmunizaciones }),
    ...(aparatos_sistemas && { aparatos_sistemas }),
    ...(informacion_fisica && { informacion_fisica }),
    ...(planes_estudio && { planes_estudio }),
  }

  return { patientData, historyData }
}

// Separa un objeto de dirty fields ya pickeados en patient vs history; los
// nested se reemplazan por el objeto completo del form para evitar perder
// subcampos no marcados como dirty pero que viajan juntos.
export function splitDirtyData(dirty, fullData) {
  const dirtyPatient = {}
  const dirtyHistory = {}

  for (const key of Object.keys(dirty)) {
    if (PATIENT_KEYS.has(key)) dirtyPatient[key] = dirty[key]
    else dirtyHistory[key] = dirty[key]
  }

  for (const key of HISTORY_NESTED_KEYS) {
    if (key in dirtyHistory) dirtyHistory[key] = nullifyEmpty(fullData[key])
  }

  return {
    patientData: Object.keys(dirtyPatient).length ? nullifyEmpty(dirtyPatient) : null,
    historyData: Object.keys(dirtyHistory).length ? nullifyEmpty(dirtyHistory) : null,
  }
}

// Rellena recursivamente un objeto de defaults con valores de source.
function fillDefaults(defaults, source) {
  const result = {}
  for (const [key, defaultVal] of Object.entries(defaults)) {
    const srcVal = source?.[key]
    if (
      defaultVal !== null &&
      typeof defaultVal === 'object' &&
      !Array.isArray(defaultVal) &&
      !(defaultVal instanceof Date) &&
      !dayjs.isDayjs(defaultVal)
    ) {
      result[key] = fillDefaults(defaultVal, srcVal)
    } else {
      result[key] = srcVal ?? defaultVal
    }
  }
  return result
}

function toDayjsOrNull(value) {
  return value ? dayjs(value) : null
}

export function buildEditDefaults(patient, historia) {
  const source = {
    ...patient,
    fecha_nacimiento: toDayjsOrNull(patient.fecha_nacimiento),
    ...historia,
    creado_at: historia.creado_at ? dayjs(historia.creado_at) : dayjs(),
    inmunizaciones: {
      ...historia.inmunizaciones,
      influenza: toDayjsOrNull(historia.inmunizaciones?.influenza),
      tetanos: toDayjsOrNull(historia.inmunizaciones?.tetanos),
      hepatitis_b: toDayjsOrNull(historia.inmunizaciones?.hepatitis_b),
      covid_19: toDayjsOrNull(historia.inmunizaciones?.covid_19),
    },
    planes_estudio: {
      ...historia.planes_estudio,
      cie10_codes: historia.planes_estudio?.cie10_codes ?? [],
    },
  }

  return fillDefaults(DEFAULT_VALUES, source)
}
