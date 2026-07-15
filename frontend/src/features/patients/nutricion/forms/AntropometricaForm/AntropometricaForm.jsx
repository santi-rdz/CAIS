import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { antropometricaFormSchema } from '@schemas/anthropometricEval'
import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import { useCreateAnthropometricEval } from '@features/patients/nutricion/hooks/useCreateAnthropometricEval'
import { useUpdateAnthropometricEval } from '@features/patients/nutricion/hooks/useUpdateAnthropometricEval'
import { EDAD_ADULTO, esFemenino } from '@features/patients/nutricion/constants'
import {
  ANTRO_BASE_DEFAULTS,
  ANTRO_ADULTO_DEFAULTS,
  ANTRO_KID_DEFAULTS,
} from '@features/patients/nutricion/forms/AntropometricaForm/formDefaults'
import {
  buildAntroPayload,
  buildEditDefaults,
} from '@features/patients/nutricion/forms/AntropometricaForm/serialize'
import EstructuraPesoStep from '@features/patients/nutricion/forms/AntropometricaForm/steps/adulto/EstructuraPesoStep'
import ImcPliieguesStep from '@features/patients/nutricion/forms/AntropometricaForm/steps/adulto/ImcPliieguesStep'
import RiesgoCvStep from '@features/patients/nutricion/forms/AntropometricaForm/steps/adulto/RiesgoCvStep'
import MedicionesStep from '@features/patients/nutricion/forms/AntropometricaForm/steps/kid/MedicionesStep'
import IndicadoresStep from '@features/patients/nutricion/forms/AntropometricaForm/steps/kid/IndicadoresStep'
import DiagnosticoVectorStep from '@features/patients/nutricion/forms/AntropometricaForm/steps/kid/DiagnosticoVectorStep'

const ADULTO = {
  steps: ['Estructura y Peso', 'IMC y Pliegues', 'Riesgo Cardiovascular'],
  components: [EstructuraPesoStep, ImcPliieguesStep, RiesgoCvStep],
}

const KID = {
  steps: ['Mediciones y Pliegues', 'Indicadores de Crecimiento', 'Diagnóstico y Vector'],
  components: [MedicionesStep, IndicadoresStep, DiagnosticoVectorStep],
}

const STEPS_FIELDS = [[], [], []]

function calcAge(fechaNacimiento) {
  if (!fechaNacimiento) return null
  return dayjs().diff(dayjs(fechaNacimiento), 'year')
}

// En edición el tipo (niño/adulto) lo dicta el propio registro; al crear se
// decide por la edad del paciente.
function resolveEsAdulto(evalAntro, patient) {
  if (evalAntro) return Boolean(evalAntro.eval_antro_ad_adulto_nutricion)
  const edad = calcAge(patient?.fecha_nacimiento)
  return edad != null && edad >= EDAD_ADULTO
}

export default function AntropometricaForm({
  historiaId,
  evalAntro,
  patient,
  initialStep = 0,
  onCloseModal,
}) {
  const { createEval, isCreating } = useCreateAnthropometricEval(historiaId)
  const { updateEval, isUpdating } = useUpdateAnthropometricEval(historiaId)
  const isEdit = !!evalAntro
  const esAdulto = resolveEsAdulto(evalAntro, patient)
  const femenino = esFemenino(patient?.genero)
  const variant = esAdulto ? ADULTO : KID

  const defaultValues = isEdit
    ? buildEditDefaults(evalAntro, esAdulto)
    : {
        ...ANTRO_BASE_DEFAULTS,
        fecha: dayjs(),
        ...(esAdulto ? { adulto: ANTRO_ADULTO_DEFAULTS } : { kid: ANTRO_KID_DEFAULTS }),
      }

  const stepForm = useStepForm(
    variant.steps,
    STEPS_FIELDS,
    defaultValues,
    zodResolver(antropometricaFormSchema),
    initialStep
  )
  const {
    currStep,
    methods: {
      formState: { isDirty },
    },
  } = stepForm

  const StepComponent = variant.components[currStep]
  const titleKind = esAdulto ? 'Adultos' : 'Infantil'

  async function onSubmit(data) {
    const fecha = data.fecha ? dayjs(data.fecha).format('YYYY-MM-DD') : undefined
    const payload = buildAntroPayload(data, { esAdulto, historiaId })

    if (isEdit) {
      const dirtyFields = stepForm.methods.formState.dirtyFields
      if (!Object.keys(dirtyFields).length) return onCloseModal?.()

      const { historia_paciente_id: _omit, ...rest } = payload
      await updateEval({ id: evalAntro.id, data: { ...rest, fecha: fecha ?? null } })
    } else {
      await createEval({ ...payload, ...(fecha && { fecha }) })
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title={
        isEdit
          ? `Editar Evaluación Antropométrica ${titleKind}`
          : `Evaluación Antropométrica ${titleKind}`
      }
      submitLabel={isEdit ? 'Actualizar evaluación' : 'Guardar evaluación'}
      steps={variant.steps}
      onSubmit={onSubmit}
      isPending={isEdit ? isUpdating : isCreating}
      isEdit={isEdit}
      isDirty={isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent femenino={femenino} />
    </StepFormShell>
  )
}
