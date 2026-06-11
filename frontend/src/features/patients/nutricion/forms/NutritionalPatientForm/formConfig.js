import IdentificacionNutrStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/IdentificacionNutrStep'
import HistoriaMedicaStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/HistoriaMedicaStep'
import AdiccionesStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/AdiccionesStep'

export const STEPS = ['Identificación', 'Historia Médica', 'Adicciones']

export const STEPS_FIELDS = [
  ['nombre', 'apellidos', 'fecha_nacimiento', 'genero', 'telefono'],
  [],
  [],
]

export const STEP_COMPONENTS = [IdentificacionNutrStep, HistoriaMedicaStep, AdiccionesStep]

export const DEFAULT_VALUES = {
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
