import { zodResolver } from '@hookform/resolvers/zod'
import { evolutionNoteSchema } from '@cais/shared/schemas/medicina/evolutionNote'
import { fechaHoraFormFields } from '@cais/shared/schemas/fields'
import { useStepForm } from '@hooks/useStepForm'
import AparatosSistemasStep from '../MedicalPatientForm/steps/AparatosSistemasStep'
import ExploracionFisicaStep from '../MedicalPatientForm/steps/ExploracionFisicaStep'
import StepFormShell from '../shared/StepFormShell'
import {
  APARATOS_DEFAULTS,
  INFORMACION_FISICA_DEFAULTS,
  PLAN_ESTUDIO_DEFAULTS,
} from '../shared/formDefaults'
import dayjs from 'dayjs'
import { mergeFechaHora } from '@lib/dateHelpers'
import { omitEmpty, pickDirty, nullifyEmpty } from '@lib/utils'
import { useCreateEvolutionNote } from '../../hooks/useCreateEvolutionNote'
import { useUpdateEvolutionNote } from '../../hooks/useUpdateEvolutionNote'
import MotivoConsultaStep from './steps/MotivoConsultaStep'
import PlanDiagnosticoStep from './steps/PlanDiagnosticoStep'

const evolutionNoteFormSchema = evolutionNoteSchema
  .omit({ creado_at: true, paciente_id: true, historia_medica_id: true })
  .extend(fechaHoraFormFields)

const STEPS = ['Consulta', 'Aparatos', 'Exploración', 'Plan']
const STEPS_FIELDS = [[], [], [], []]

const STEP_COMPONENTS = [
  MotivoConsultaStep,
  AparatosSistemasStep,
  ExploracionFisicaStep,
  PlanDiagnosticoStep,
]

const DEFAULT_VALUES_TEMPLATE = {
  // Step 1 – fecha y hora (computed dynamically)
  motivo_consulta: '',
  ant_gine_andro: '',
  // Step 2 – aparatos_sistemas
  aparatos_sistemas: APARATOS_DEFAULTS,
  // Step 3 – informacion_fisica
  informacion_fisica: INFORMACION_FISICA_DEFAULTS,
  // Step 4 – planes_estudio
  planes_estudio: PLAN_ESTUDIO_DEFAULTS,
}

function getCreateDefaults() {
  return {
    ...DEFAULT_VALUES_TEMPLATE,
    fecha: dayjs(),
    hora: dayjs(),
  }
}

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

function buildEditDefaults(note) {
  const createdAt = note?.creado_at ? dayjs(note.creado_at) : dayjs()
  const source = {
    ...note,
    planes_estudio: {
      ...note?.planes_estudio,
      cie10_codes: note?.planes_estudio?.cie10_codes ?? [],
    },
  }

  return {
    ...fillDefaults(DEFAULT_VALUES_TEMPLATE, source),
    fecha: createdAt,
    hora: createdAt,
  }
}

export default function EvolutionNoteForm({
  pacienteId,
  patientGenero,
  historiaId,
  note,
  onCloseModal,
}) {
  const { createNote, isCreating } = useCreateEvolutionNote(pacienteId)
  const { updateNote, isUpdating } = useUpdateEvolutionNote(pacienteId)
  const isEdit = !!note
  const defaultValues = isEdit ? buildEditDefaults(note) : getCreateDefaults()
  const stepForm = useStepForm(
    STEPS,
    STEPS_FIELDS,
    defaultValues,
    zodResolver(evolutionNoteFormSchema)
  )
  const {
    currStep,
    methods: {
      formState: { isDirty },
    },
  } = stepForm

  const StepComponent = STEP_COMPONENTS[currStep]

  const NESTED_KEYS = [
    'aparatos_sistemas',
    'informacion_fisica',
    'planes_estudio',
  ]

  async function onSubmit(data) {
    if (isEdit) {
      const dirtyFields = stepForm.methods.formState.dirtyFields
      if (!Object.keys(dirtyFields).length) return onCloseModal?.()

      const dirty = pickDirty(data, dirtyFields)

      for (const key of NESTED_KEYS) {
        if (key in dirty) {
          dirty[key] = nullifyEmpty(data[key])
        }
      }

      const payload = {
        ...nullifyEmpty(dirty),
        creado_at: mergeFechaHora(data.fecha, data.hora),
      }

      await updateNote(note.id, payload)
    } else {
      const cleaned = omitEmpty(data)
      const payload = {
        paciente_id: pacienteId,
        ...(historiaId && { historia_medica_id: historiaId }),
        creado_at: mergeFechaHora(data.fecha, data.hora),
        ...(cleaned.motivo_consulta && {
          motivo_consulta: cleaned.motivo_consulta,
        }),
        ...(cleaned.ant_gine_andro && {
          ant_gine_andro: cleaned.ant_gine_andro,
        }),
        ...(cleaned.aparatos_sistemas && {
          aparatos_sistemas: cleaned.aparatos_sistemas,
        }),
        ...(cleaned.informacion_fisica && {
          informacion_fisica: cleaned.informacion_fisica,
        }),
        ...(cleaned.planes_estudio && {
          planes_estudio: cleaned.planes_estudio,
        }),
      }

      await createNote(payload)
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title={isEdit ? 'Editar Nota de Evolución' : 'Nueva Nota de Evolución'}
      submitLabel={isEdit ? 'Actualizar nota' : 'Guardar nota'}
      steps={STEPS}
      onSubmit={onSubmit}
      isPending={isEdit ? isUpdating : isCreating}
      isEdit={isEdit}
      isDirty={isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent patientGenero={patientGenero} />
    </StepFormShell>
  )
}
