import dayjs from 'dayjs'
import { parseDate } from '@lib/dateHelpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { calGetNutrFormSchema } from '@schemas/calGetNutr'
import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import { omitEmpty, nullifyEmpty, fillDefaults } from '@lib/utils'
import { useCreateCalGetNutr } from '@features/patients/nutricion/hooks/useCreateCalGetNutr'
import { useUpdateCalGetNutr } from '@features/patients/nutricion/hooks/useUpdateCalGetNutr'
import GetEstimacionStep from '@features/patients/nutricion/forms/CalGetNutrForm/steps/GetEstimacionStep'
import EquivalentesStep from '@features/patients/nutricion/forms/CalGetNutrForm/steps/EquivalentesStep'
import { CAL_GET_NUTR_DEFAULTS } from '@features/patients/nutricion/forms/CalGetNutrForm/formDefaults'

const STEPS = ['Estimación del GET', 'Distribución de equivalentes']
const STEPS_FIELDS = [[], []]
const STEP_COMPONENTS = [GetEstimacionStep, EquivalentesStep]

// Separa la fecha (dayjs) de los campos que se guardan crudos (antropometría,
// inputs GET y cantidades de EQ).
function splitCampos(data) {
  const { fecha_eval, ...campos } = data
  return { fecha_eval, campos }
}

function getCreateDefaults() {
  return { ...CAL_GET_NUTR_DEFAULTS, fecha_eval: dayjs() }
}

function buildEditDefaults(registro) {
  return {
    ...fillDefaults(CAL_GET_NUTR_DEFAULTS, registro),
    fecha_eval: parseDate(registro?.fecha_eval) ?? dayjs(),
  }
}

export default function CalGetNutrForm({ historiaId, registro, initialStep = 0, onCloseModal }) {
  const { createRegistro, isCreating } = useCreateCalGetNutr(historiaId)
  const { updateRegistro, isUpdating } = useUpdateCalGetNutr(historiaId)
  const isEdit = !!registro
  const defaultValues = isEdit ? buildEditDefaults(registro) : getCreateDefaults()
  const stepForm = useStepForm(
    STEPS,
    STEPS_FIELDS,
    defaultValues,
    zodResolver(calGetNutrFormSchema),
    initialStep
  )
  const {
    currStep,
    methods: {
      formState: { isDirty, dirtyFields },
    },
  } = stepForm

  const StepComponent = STEP_COMPONENTS[currStep]

  async function onSubmit(data) {
    // Fecha inválida del DatePicker → se omite en vez de mandar 'Invalid Date'.
    const fecha = data.fecha_eval ? dayjs(data.fecha_eval) : null
    const fechaStr = fecha?.isValid() ? fecha.format('YYYY-MM-DD') : undefined
    const { campos } = splitCampos(data)

    if (isEdit) {
      if (!Object.keys(dirtyFields).length) return onCloseModal?.()

      const payload = {}
      if (dirtyFields.fecha_eval) payload.fecha_eval = fechaStr
      const changed = {}
      for (const key of Object.keys(campos)) {
        if (dirtyFields[key]) changed[key] = campos[key]
      }
      Object.assign(payload, nullifyEmpty(changed))

      await updateRegistro({ id: registro.id, data: payload })
    } else {
      const payload = {
        historia_paciente_id: historiaId,
        ...(fechaStr && { fecha_eval: fechaStr }),
        ...omitEmpty(campos),
      }
      await createRegistro(payload)
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title={isEdit ? 'Editar cálculo de GET nutricional' : 'Nuevo cálculo de GET nutricional'}
      submitLabel={isEdit ? 'Actualizar cálculo' : 'Guardar cálculo'}
      steps={STEPS}
      onSubmit={onSubmit}
      isPending={isEdit ? isUpdating : isCreating}
      isEdit={isEdit}
      isDirty={isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent />
    </StepFormShell>
  )
}
