import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '../shared/StepFormShell'
import {
  APARATOS_DEFAULTS,
  INFORMACION_FISICA_DEFAULTS,
  PLAN_ESTUDIO_DEFAULTS,
} from '../shared/formDefaults'
import DatosPersonalesStep from './steps/DatosPersonalesStep'
import AntecedentesFamiliaresStep from './steps/AntecedentesFamiliaresStep'
import AntecedentesNoPatStep from './steps/AntecedentesNoPatStep'
import AntecedentesPatologicosStep from './steps/AntecedentesPatologicosStep'
import AparatosSistemasStep from './steps/AparatosSistemasStep'
import ExploracionFisicaStep from './steps/ExploracionFisicaStep'
import MotivoConsultaPlanStep from './steps/MotivoConsultaPlanStep'

const STEPS = [
  'Identificación',
  'Heredofamiliares',
  'No Patológicos',
  'Patológicos',
  'Aparatos',
  'Exploración',
  'Plan',
]

const STEPS_FIELDS = [['nombre'], [], [], [], [], [], []]

const STEP_COMPONENTS = [
  DatosPersonalesStep,
  AntecedentesFamiliaresStep,
  AntecedentesNoPatStep,
  AntecedentesPatologicosStep,
  AparatosSistemasStep,
  ExploracionFisicaStep,
  MotivoConsultaPlanStep,
]

const DEFAULT_VALUES = {
  // Step 1 – pacientes
  nombre: '',
  apellidos: '',
  fecha_nacimiento: null,
  genero: '',
  correo: '',
  telefono: '',
  nss: '',
  curp: '',
  fuente_informacion: '',
  estado_civil: '',
  ocupacion: '',
  religion: '',
  dir_calle: '',
  lugar_nacimiento: '',
  contacto_emergencia: '',
  telefono_emergencia: '',
  parentesco_emergencia: '',
  // Step 2 – antecedentes_familiares
  padre: '',
  madre: '',
  abuelo_paterno: '',
  abuela_paterna: '',
  abuelo_materno: '',
  abuela_materna: '',
  otros: '',
  // Step 3 – servicios + inmunizaciones
  gas: false,
  luz: false,
  agua: false,
  drenaje: false,
  cable_tel: false,
  internet: false,
  influenza: null,
  tetanos: null,
  hepatitis_b: null,
  covid_19: null,
  tipo_sangre: '',
  vacunas_infancia_completas: null,
  // Step 4 – antecedentes_patologicos
  cronico_degenerativos: '',
  quirurgicos: '',
  hospitalizaciones: '',
  traumaticos: '',
  transfusionales: '',
  transplantes: '',
  alergicos: '',
  infectocontagiosos: '',
  toxicomanias: '',
  psicologia_psiquiatria: '',
  gyo: '',
  enfermedades_congenitas: '',
  enfermedades_infancia: '',
  // Step 5 – aparatos_sistemas
  ...APARATOS_DEFAULTS,
  // Step 6 – informacion_fisica
  ...INFORMACION_FISICA_DEFAULTS,
  // Step 7 – historia + planes_estudio
  motivo_consulta: '',
  historia_enfermedad_actual: '',
  ...PLAN_ESTUDIO_DEFAULTS,
}

export default function MedicalPatientForm({ onCloseModal }) {
  const stepForm = useStepForm(STEPS, STEPS_FIELDS, DEFAULT_VALUES)
  const { currStep } = stepForm

  const StepComponent = STEP_COMPONENTS[currStep]

  function onSubmit(_data) {
    // TODO: wire up API — createPatient + createHistoriaMedica
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title="Registro de Nuevo Paciente"
      submitLabel="Guardar paciente"
      steps={STEPS}
      onSubmit={onSubmit}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent />
    </StepFormShell>
  )
}
