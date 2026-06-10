import dayjs from 'dayjs'
import {
  APARATOS_DEFAULTS,
  INFORMACION_FISICA_DEFAULTS,
  PLAN_ESTUDIO_DEFAULTS,
} from '@features/patients/shared/forms/formDefaults'
import DatosPersonalesStep from '@features/patients/medicina/forms/MedicalPatientForm/steps/DatosPersonalesStep'
import AntecedentesFamiliaresStep from '@features/patients/medicina/forms/MedicalPatientForm/steps/AntecedentesFamiliaresStep'
import AntecedentesNoPatStep from '@features/patients/medicina/forms/MedicalPatientForm/steps/AntecedentesNoPatStep'
import AntecedentesPatologicosStep from '@features/patients/medicina/forms/MedicalPatientForm/steps/AntecedentesPatologicosStep'
import AparatosSistemasStep from '@features/patients/medicina/forms/MedicalPatientForm/steps/AparatosSistemasStep'
import ExploracionFisicaStep from '@features/patients/medicina/forms/MedicalPatientForm/steps/ExploracionFisicaStep'
import MotivoConsultaPlanStep from '@features/patients/medicina/forms/MedicalPatientForm/steps/MotivoConsultaPlanStep'

export const STEPS = [
  'Identificación',
  'Heredofamiliares',
  'No Patológicos',
  'Patológicos',
  'Aparatos',
  'Exploración',
  'Plan',
]

export const STEPS_FIELDS = [
  ['nombre', 'apellidos', 'fecha_nacimiento', 'genero', 'telefono'],
  [],
  [],
  [],
  [],
  [],
  [],
]

export const STEP_COMPONENTS = [
  DatosPersonalesStep,
  AntecedentesFamiliaresStep,
  AntecedentesNoPatStep,
  AntecedentesPatologicosStep,
  AparatosSistemasStep,
  ExploracionFisicaStep,
  MotivoConsultaPlanStep,
]

// En modo clone el paciente ya existe — omitimos el step de Identificación.
export const CLONE_STEPS = STEPS.slice(1)
export const CLONE_STEPS_FIELDS = STEPS_FIELDS.slice(1)
export const CLONE_STEP_COMPONENTS = STEP_COMPONENTS.slice(1)

export const DEFAULT_VALUES = {
  // Step 1 – pacientes
  nombre: '',
  apellidos: '',
  fecha_nacimiento: null,
  genero: '',
  es_externo: false,
  correo: '',
  telefono: '',
  nss: '',
  curp_matricula: '',
  fuente_informacion: '',
  estado_civil: '',
  ocupacion: '',
  religion: '',
  domicilio: '',
  lugar_nacimiento: '',
  contacto_emergencia: '',
  telefono_emergencia: '',
  parentesco_emergencia: '',
  // Step 2 – antecedentes_familiares
  antecedentes_familiares: {
    padre: '',
    madre: '',
    abuelo_paterno: '',
    abuela_paterna: '',
    abuelo_materno: '',
    abuela_materna: '',
    otros: '',
  },
  // Step 3 – antecedentes_no_patologicos + servicios + inmunizaciones
  antecedentes_no_patologicos: {
    alimentacion_adecuada: undefined,
    calidad_cantidad_alimentacion: '',
    higiene_adecuada: '',
    actividad_fisica: '',
    inmunizaciones_completas: undefined,
    zoonosis: undefined,
    tipo_zoonosis: '',
  },
  servicios: {
    gas: undefined,
    luz: undefined,
    agua: undefined,
    drenaje: undefined,
    cable_tel: undefined,
    internet: undefined,
  },
  inmunizaciones: {
    influenza: null,
    tetanos: null,
    hepatitis_b: null,
    covid_19: null,
    otros: '',
  },
  tipo_sangre: '',
  vacunas_infancia_completas: undefined,
  // Step 4 – antecedentes_patologicos
  antecedentes_patologicos: {
    cronico_degenerativos: '',
    quirurgicos: '',
    hospitalizaciones: '',
    traumaticos: '',
    transfusionales: '',
    transplantes: '',
    alergicos: '',
    infectocontagiosos: '',
    toxicomanias: '',
    covid_19: '',
    psicologia_psiquiatria: '',
    gyo: '',
    enfermedades_congenitas: '',
    enfermedades_infancia: '',
  },
  // Step 5 – aparatos_sistemas
  aparatos_sistemas: APARATOS_DEFAULTS,
  // Step 6 – informacion_fisica
  informacion_fisica: INFORMACION_FISICA_DEFAULTS,
  // Step 7 – historias_medicas directos + planes_estudio
  // creado_at se resuelve en `getDefaultValues()` para evitar timestamps que
  // se evalúan al cargar el módulo y luego envejecen.
  creado_at: null,
  motivo_consulta: '',
  historia_enfermedad_actual: '',
  planes_estudio: PLAN_ESTUDIO_DEFAULTS,
}

export function getDefaultValues() {
  return { ...DEFAULT_VALUES, creado_at: dayjs() }
}
