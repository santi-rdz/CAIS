import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { tpanFormSchema } from '@schemas/tpan'
import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import { omitEmpty, fillDefaults } from '@lib/utils'
import { useCreateTpan } from '@features/patients/nutricion/hooks/useCreateTpan'
import { useUpdateTpan } from '@features/patients/nutricion/hooks/useUpdateTpan'
import TpanFormFields from '@features/patients/nutricion/forms/TpanForm/TpanFormFields'
import { TPAN_DEFAULTS } from '@features/patients/nutricion/forms/TpanForm/formDefaults'
import {
  TPAN_TEXT_FIELDS,
  pickTpanText,
  parseProgreso,
  progresoToField,
} from '@features/patients/nutricion/forms/TpanForm/serialize'

const STEPS = ['Registro TPAN']
const STEPS_FIELDS = [[]]

function getCreateDefaults() {
  return { ...TPAN_DEFAULTS, fecha_eval: dayjs() }
}

function buildEditDefaults(tpan) {
  return {
    ...fillDefaults(TPAN_DEFAULTS, tpan),
    progreso: progresoToField(tpan?.progreso),
    fecha_eval: tpan?.fecha_eval ? dayjs(tpan.fecha_eval) : dayjs(),
  }
}

export default function TpanForm({ historiaId, tpan, initialStep = 0, onCloseModal }) {
  const { createTpan, isCreating } = useCreateTpan(historiaId)
  const { updateTpan, isUpdating } = useUpdateTpan(historiaId)
  const isEdit = !!tpan
  const defaultValues = isEdit ? buildEditDefaults(tpan) : getCreateDefaults()
  const stepForm = useStepForm(
    STEPS,
    STEPS_FIELDS,
    defaultValues,
    zodResolver(tpanFormSchema),
    initialStep
  )
  const {
    methods: {
      formState: { isDirty },
    },
  } = stepForm

  async function onSubmit(data) {
    const fechaStr = data.fecha_eval ? dayjs(data.fecha_eval).format('YYYY-MM-DD') : undefined

    if (isEdit) {
      const dirtyFields = stepForm.methods.formState.dirtyFields
      if (!Object.keys(dirtyFields).length) return onCloseModal?.()

      const payload = {}
      if (dirtyFields.fecha_eval) payload.fecha_eval = fechaStr ?? null
      for (const f of TPAN_TEXT_FIELDS) {
        if (dirtyFields[f]) payload[f] = data[f]?.trim() ? data[f].trim() : null
      }
      if (dirtyFields.progreso) payload.progreso = parseProgreso(data.progreso) ?? null

      await updateTpan({ id: tpan.id, data: payload })
    } else {
      const progreso = parseProgreso(data.progreso)
      const payload = {
        historia_paciente_id: historiaId,
        ...(fechaStr && { fecha_eval: fechaStr }),
        ...omitEmpty(pickTpanText(data)),
        ...(progreso != null && { progreso }),
      }

      await createTpan(payload)
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title={isEdit ? 'Editar Registro TPAN' : 'Agregar Registro TPAN'}
      submitLabel={isEdit ? 'Actualizar TPAN' : 'Guardar TPAN'}
      steps={STEPS}
      onSubmit={onSubmit}
      isPending={isEdit ? isUpdating : isCreating}
      isEdit={isEdit}
      isDirty={isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <TpanFormFields />
    </StepFormShell>
  )
}
