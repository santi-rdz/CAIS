import {
  SUENO_ROW_KEYS,
  ACT_FISICA_ROW_KEYS,
  buildMonitoringFieldRow,
} from '@features/patients/nutricion/forms/monitoreoRows'
import IdentificacionNutrStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/IdentificacionNutrStep'
import HistoriaMedicaStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/HistoriaMedicaStep'
import TratamientoAlternativoStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/TratamientoAlternativoStep'
import AdiccionesStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/AdiccionesStep'
import EvalSuenoStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/EvalSuenoStep'
import EvalActFisicaStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/EvalActFisicaStep'

export const STEPS = [
  'Identificación',
  'Historia Médica',
  'Tratamiento Alternativo',
  'Adicciones',
  'Calidad del Sueño',
  'Actividad Física',
]

export const STEPS_FIELDS = [
  ['nombre', 'apellidos', 'fecha_nacimiento', 'genero', 'telefono'],
  [],
  [],
  [],
  [],
  [],
]

export const STEP_COMPONENTS = [
  IdentificacionNutrStep,
  HistoriaMedicaStep,
  TratamientoAlternativoStep,
  AdiccionesStep,
  EvalSuenoStep,
  EvalActFisicaStep,
]

// Clone / nuevo: omite Identificación pero incluye monitoreo.
export const HISTORIA_STEPS = STEPS.slice(1)
export const HISTORIA_STEPS_FIELDS = STEPS_FIELDS.slice(1)
export const HISTORIA_STEP_COMPONENTS = STEP_COMPONENTS.slice(1)

// Editar historia: omite Identificación Y los steps de monitoreo (se gestionan
// desde los modales independientes en la vista de detalle).
export const EDIT_HISTORIA_STEPS = STEPS.slice(1, 4)
export const EDIT_HISTORIA_STEPS_FIELDS = STEPS_FIELDS.slice(1, 4)
export const EDIT_HISTORIA_STEP_COMPONENTS = STEP_COMPONENTS.slice(1, 4)

const STATIC_DEFAULT_VALUES = {
  // Step 1 — pacientes
  nombre: '',
  apellidos: '',
  fecha_nacimiento: null,
  genero: '',
  correo: '',
  telefono: '',
  ocupacion: '',
  estado_civil: '',
  nivel_educativo: '',
  salario_dia: '',
  motivo_consulta: '',
  es_externo: false,
  domicilio: '',
  fuente_informacion: '',
  lugar_nacimiento: '',
  religion: '',
  nss: '',
  curp_matricula: '',
  contacto_emergencia: '',
  telefono_emergencia: '',
  parentesco_emergencia: '',
  // Step 2 — historias_medicas_nutricion (presenta_* es toggle solo-UI)
  presenta_enfermedad: 'no',
  historias_medicas_nutricion: [],
  // Step 2 — tratamiento_alt_nutricion
  presenta_tratamiento: 'no',
  tratamiento_alt_nutricion: [],
  // Step 3 — adicciones (campos planos según la tabla adicciones)
  adicciones: {
    adicto_tabaco: 'no',
    tabaco_frecuencia: '',
    num_cigarros_d: '',
    adicto_alcohol: 'no',
    alcohol_frecuencia: '',
    ml_ocasion: '',
    adicto_droga: 'no',
    drogas_frecuencia: '',
    cual_droga: '',
    adicto_med_contr: 'no',
    med_contr_frecuencia: '',
    cual_med_contr: '',
  },
}

// Factory: genera defaults frescos con una evaluación inicial de monitoreo con
// fecha = hoy. Debe llamarse en tiempo de render, no en importación, porque
// dayjs() (dentro de buildMonitoringFieldRow) tiene que resolver a la fecha
// actual del momento en que se abre el form.
export function getDefaultValues() {
  return {
    ...STATIC_DEFAULT_VALUES,
    eval_cal_sueno: [buildMonitoringFieldRow(SUENO_ROW_KEYS, null)],
    eval_act_fisica_nutricion: [buildMonitoringFieldRow(ACT_FISICA_ROW_KEYS, null)],
  }
}

// Alias para los contextos donde se necesita el shape base sin monitoreo
// (buildEditDefaults lo sobreescribe siempre, así que recibir [] está bien).
export const DEFAULT_VALUES = {
  ...STATIC_DEFAULT_VALUES,
  eval_cal_sueno: [],
  eval_act_fisica_nutricion: [],
}
