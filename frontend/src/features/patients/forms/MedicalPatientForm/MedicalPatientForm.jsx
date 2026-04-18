import dayjs from 'dayjs'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import { dayjsDateSchema } from '@cais/shared/schemas/fields'
import { medicalHistorySchema } from '@cais/shared/schemas/medicina/medicalHistory'
import { useStepForm } from '@hooks/useStepForm'
import { formatFecha } from '@lib/dateHelpers'
import { omitEmpty, pickDirty, nullifyEmpty } from '@lib/utils'
import { useCreatePatientWithHistory } from '../../hooks/useCreatePatientWithHistory'
import { useCreateMedicalHistory } from '../../hooks/useCreateMedicalHistory'
import { useUpdatePatientWithHistory } from '../../hooks/useUpdatePatientWithHistory'
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

const medicalPatientFormSchema = z.object({
  ...patientSchema.shape,
  ...medicalHistorySchema.omit({ paciente_id: true }).shape,
  apellidos: z.string().min(2, 'Los apellidos son requeridos'),
  fecha_nacimiento: dayjsDateSchema,
  creado_at: dayjsDateSchema,
})

const STEPS = [
  'Identificación',
  'Heredofamiliares',
  'No Patológicos',
  'Patológicos',
  'Aparatos',
  'Exploración',
  'Plan',
]

const STEPS_FIELDS = [
  ['nombre', 'apellidos', 'fecha_nacimiento', 'genero', 'telefono'],
  [],
  [],
  [],
  [],
  [],
  [],
]

const STEP_COMPONENTS = [
  DatosPersonalesStep,
  AntecedentesFamiliaresStep,
  AntecedentesNoPatStep,
  AntecedentesPatologicosStep,
  AparatosSistemasStep,
  ExploracionFisicaStep,
  MotivoConsultaPlanStep,
]

// En modo clone el paciente ya existe — omitimos el step de Identificación
const CLONE_STEPS = STEPS.slice(1)
const CLONE_STEPS_FIELDS = STEPS_FIELDS.slice(1)
const CLONE_STEP_COMPONENTS = STEP_COMPONENTS.slice(1)

const DEFAULT_VALUES = {
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
  creado_at: dayjs(),
  motivo_consulta: '',
  historia_enfermedad_actual: '',
  planes_estudio: PLAN_ESTUDIO_DEFAULTS,
}

const PATIENT_KEYS = new Set([...Object.keys(patientSchema.shape), 'apellidos'])

const HISTORY_NESTED = new Set([
  'antecedentes_familiares',
  'antecedentes_patologicos',
  'antecedentes_no_patologicos',
  'servicios',
  'inmunizaciones',
  'aparatos_sistemas',
  'informacion_fisica',
  'planes_estudio',
])

/**
 * Filtra un objeto dejando solo las keys marcadas como dirty por react-hook-form.
 * Para objetos anidados (dirtyFields: { antecedentes_familiares: { padre: true } }),
 * incluye el objeto completo si al menos un subcampo cambió.
 */
function splitFormData(rawData) {
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
    apellidos: _apellidos,
    ...patientFields
  } = data

  const patientData = {
    ...patientFields,
    nombre: `${rawData.nombre} ${rawData.apellidos}`.trim(),
  }

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

/**
 * Rellena recursivamente un objeto de defaults con valores de source.
 * Para cada key del defaults, usa source[key] si existe, sino el default.
 * Objetos anidados se procesan recursivamente.
 */
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

function buildEditDefaults(patient, historia) {
  const nameParts = (patient.nombre ?? '').split(' ')

  const source = {
    ...patient,
    nombre: nameParts[0] ?? '',
    apellidos: nameParts.slice(1).join(' '),
    fecha_nacimiento: patient.fecha_nacimiento
      ? dayjs(patient.fecha_nacimiento)
      : null,
    ...historia,
    creado_at: historia.creado_at ? dayjs(historia.creado_at) : dayjs(),
    inmunizaciones: {
      ...historia.inmunizaciones,
      influenza: historia.inmunizaciones?.influenza
        ? dayjs(historia.inmunizaciones.influenza)
        : null,
      tetanos: historia.inmunizaciones?.tetanos
        ? dayjs(historia.inmunizaciones.tetanos)
        : null,
      hepatitis_b: historia.inmunizaciones?.hepatitis_b
        ? dayjs(historia.inmunizaciones.hepatitis_b)
        : null,
      covid_19: historia.inmunizaciones?.covid_19
        ? dayjs(historia.inmunizaciones.covid_19)
        : null,
    },
    planes_estudio: {
      ...historia.planes_estudio,
      cie10_codes: historia.planes_estudio?.cie10_codes ?? [],
    },
  }

  return fillDefaults(DEFAULT_VALUES, source)
}

export default function MedicalPatientForm({
  onCloseModal,
  patient,
  historia,
  cloneHistoria,
  onCreated,
  historiaOnly = false,
  patientOnly = false,
}) {
  const isEdit = !!patient && (!!historia || patientOnly)
  const isClone = !isEdit && !!patient && !!cloneHistoria

  const { register: registerPatient, isRegistering } =
    useCreatePatientWithHistory()
  const { createHistory, isCreating } = useCreateMedicalHistory()
  const { update: updatePatient, isUpdating } = useUpdatePatientWithHistory()

  const defaultValues = isEdit
    ? buildEditDefaults(patient, historia ?? {})
    : isClone
      ? { ...buildEditDefaults(patient, cloneHistoria), creado_at: dayjs() }
      : DEFAULT_VALUES

  const skipPatientStep = isClone || (isEdit && historiaOnly)
  const activeSteps = patientOnly
    ? [STEPS[0]]
    : skipPatientStep
      ? CLONE_STEPS
      : STEPS
  const activeStepsFields = patientOnly
    ? [STEPS_FIELDS[0]]
    : skipPatientStep
      ? CLONE_STEPS_FIELDS
      : STEPS_FIELDS
  const activeStepComponents = patientOnly
    ? [STEP_COMPONENTS[0]]
    : skipPatientStep
      ? CLONE_STEP_COMPONENTS
      : STEP_COMPONENTS

  const stepForm = useStepForm(
    activeSteps,
    activeStepsFields,
    defaultValues,
    zodResolver(medicalPatientFormSchema)
  )
  const { currStep, methods } = stepForm
  const { isDirty } = methods.formState

  const StepComponent = activeStepComponents[currStep]

  async function onSubmit(data) {
    if (isEdit) {
      const dirtyFields = methods.formState.dirtyFields
      if (!Object.keys(dirtyFields).length) return onCloseModal?.()

      const dirty = pickDirty(data, dirtyFields)

      let patientData = null
      let historyData = null

      const dirtyPatient = {}
      const dirtyHistory = {}

      for (const key of Object.keys(dirty)) {
        if (PATIENT_KEYS.has(key)) {
          dirtyPatient[key] = dirty[key]
        } else {
          dirtyHistory[key] = dirty[key]
        }
      }

      if (Object.keys(dirtyPatient).length) {
        // Si nombre o apellidos cambió, enviar nombre completo
        if (
          dirtyPatient.nombre !== undefined ||
          dirtyPatient.apellidos !== undefined
        ) {
          dirtyPatient.nombre = `${data.nombre} ${data.apellidos}`.trim()
          delete dirtyPatient.apellidos
        }
        patientData = nullifyEmpty(dirtyPatient)
      }

      if (Object.keys(dirtyHistory).length) {
        // Para nested objects, enviar el objeto completo si algún subcampo cambió
        for (const key of HISTORY_NESTED) {
          if (key in dirtyHistory) {
            dirtyHistory[key] = nullifyEmpty(data[key])
          }
        }
        historyData = nullifyEmpty(dirtyHistory)
      }

      await updatePatient({
        patientId: patient.id,
        historyId: historia?.id,
        patientData,
        historyData,
      })
    } else if (isClone) {
      const { historyData } = splitFormData(data)
      const result = await createHistory({
        pacienteId: patient.id,
        historyData,
      })
      onCreated?.(result?.history?.id)
    } else {
      const { patientData, historyData } = splitFormData(data)
      await registerPatient({ patientData, historyData })
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title={
        patientOnly
          ? 'Editar Info del Paciente'
          : isEdit
            ? historiaOnly
              ? 'Editar Historia Médica'
              : 'Editar Paciente'
            : isClone
              ? 'Nueva Historia Médica'
              : 'Registro de Nuevo Paciente'
      }
      subtitle={
        isEdit && historiaOnly
          ? formatFecha(historia.creado_at)
          : isClone
            ? formatFecha(cloneHistoria.creado_at)
            : undefined
      }
      description={
        isClone
          ? 'Se tomó la historia más reciente como base. Modifica los campos necesarios antes de guardar.'
          : undefined
      }
      submitLabel={
        patientOnly
          ? 'Actualizar paciente'
          : isEdit
            ? historiaOnly
              ? 'Actualizar historia'
              : 'Actualizar paciente'
            : isClone
              ? 'Crear historia'
              : 'Guardar paciente'
      }
      steps={activeSteps}
      onSubmit={onSubmit}
      isPending={isEdit ? isUpdating : isClone ? isCreating : isRegistering}
      isEdit={isEdit}
      isDirty={isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent />
    </StepFormShell>
  )
}
