import { FormProvider } from 'react-hook-form'
import { HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import Modal from '@components/Modal'
import ModalBody from '@components/ModalBody'
import ModalActions from '@components/ModalActions'
import Stepper from '@components/Stepper'
import { useStepForm } from '@hooks/useStepForm'
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

const DEFAULT_VALUES = {
  // Step 1 – pacientes
  nombre: '',
  apellidos: '',
  fechaNacimiento: null,
  genero: '',
  correo: '',
  telefono: '',
  nss: '',
  curp: '',
  fuenteInformacion: '',
  estadoCivil: '',
  nivelEducativo: '',
  ocupacion: '',
  religion: '',
  dir_calle: '',
  dir_numero: '',
  dir_colonia: '',
  dir_ciudad: '',
  dir_estado: '',
  dir_cp: '',
  lugarNacimiento: '',
  grupoEtnico: '',
  contactoEmergencia: '',
  telefonoEmergencia: '',
  parentescoEmergencia: '',
  esExterno: false,
  // Step 2 – antecedentes_familiares
  af_padre: '',
  af_madre: '',
  af_abueloPaterno: '',
  af_abuelaPaterna: '',
  af_abueloMaterno: '',
  af_abuelaMaterna: '',
  af_otros: '',
  // Step 3 – servicios + inmunizaciones
  srv_gas: false,
  srv_luz: false,
  srv_agua: false,
  srv_drenaje: false,
  srv_cableTel: false,
  srv_internet: false,
  inm_influenza: null,
  inm_tetanos: null,
  inm_hepatitisB: null,
  inm_covid19: null,
  inm_otros: '',
  tipoSangre: '',
  vacunasInfanciaCompletas: null,
  // Step 4 – antecedentes_patologicos
  ap_cronicoDegenerativos: '',
  ap_quirurgicos: '',
  ap_hospitalizaciones: '',
  ap_traumaticos: '',
  ap_transfusionales: '',
  ap_transplantes: '',
  ap_alergicos: '',
  ap_infectocontagiosos: '',
  ap_toxicomanias: '',
  ap_covid19: '',
  ap_psicologiaPsiquiatria: '',
  ap_gyo: '',
  ap_enfermedadesCongenitas: '',
  ap_enfermedadesInfancia: '',
  // Step 5 – aparatos_sistemas
  as_neurologico: '',
  as_cardiovascular: '',
  as_respiratorio: '',
  as_hematologico: '',
  as_digestivo: '',
  as_musculoesqueletico: '',
  as_genitourinario: '',
  as_endocrinologico: '',
  as_metabolico: '',
  as_nutricional: '',
  // Step 6 – informacion_fisica
  if_peso: '',
  if_altura: '',
  if_paSistolica: '',
  if_paDiastolica: '',
  if_fc: '',
  if_fr: '',
  if_circCintura: '',
  if_circCadera: '',
  if_spO2: '',
  if_glucosaCapilar: '',
  if_temperatura: '',
  if_exploracionFisica: '',
  if_habitoExterior: '',
  // Step 7 – historia + planes_estudio
  motivoConsulta: '',
  historiaEnfermedadActual: '',
  planTratamiento: '',
  tratamiento: '',
  fechaGeneracion: null,
  cie10Codes: [],
}

const STEP_COMPONENTS = [
  DatosPersonalesStep,
  AntecedentesFamiliaresStep,
  AntecedentesNoPatStep,
  AntecedentesPatologicosStep,
  AparatosSistemasStep,
  ExploracionFisicaStep,
  MotivoConsultaPlanStep,
]

export default function MedicalPatientForm({ onCloseModal }) {
  const {
    currStep,
    setCurrStep,
    handleNext,
    handleStepClick,
    isLast,
    methods,
    handleSubmit,
    getFormKeyDown,
  } = useStepForm(STEPS, STEPS_FIELDS, DEFAULT_VALUES)

  function onSubmit(data) {
    // TODO: wire up API — createPatient + createHistoriaMedica
    console.log('Nuevo paciente:', data)
    onCloseModal?.()
  }

  const StepComponent = STEP_COMPONENTS[currStep]

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ── Header fijo: título + stepper ── */}
        <Modal.Heading>
          <Modal.Title>Registro de Nuevo Paciente</Modal.Title>
          <Stepper
            steps={STEPS}
            current={currStep}
            setCurrStep={handleStepClick}
            className="mt-4"
          />
        </Modal.Heading>

        {/* ── Contenido scrollable ── */}
        <ModalBody>
          <form onKeyDown={getFormKeyDown(onSubmit)}>
            <StepComponent />
          </form>
        </ModalBody>

        {/* ── Footer fijo: navegación ── */}
        <ModalActions
          onClose={onCloseModal}
          primaryAction={{
            label: isLast ? 'Guardar paciente' : 'Siguiente',
            icon: isLast ? (
              <HiCheck strokeWidth={1} />
            ) : (
              <HiChevronRight strokeWidth={1} />
            ),
            iconPos: isLast ? 'left' : 'right',
            onClick: isLast ? handleSubmit(onSubmit) : handleNext,
          }}
          secondaryAction={{
            label: 'Anterior',
            icon: <HiChevronLeft strokeWidth={1} />,
            onClick: () => setCurrStep((p) => p - 1),
            disabled: currStep === 0,
          }}
        />
      </div>
    </FormProvider>
  )
}
