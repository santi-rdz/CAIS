import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { rec24hFormSchema } from '@schemas/rec24h'
import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import { omitEmpty, nullifyEmpty, fillDefaults } from '@lib/utils'
import { useCreateRec24h } from '@features/patients/nutricion/hooks/useCreateRec24h'
import { useUpdateRec24h } from '@features/patients/nutricion/hooks/useUpdateRec24h'
import ObjetivosStep from '@features/patients/nutricion/forms/Rec24hForm/steps/ObjetivosStep'
import AlimentosStep from '@features/patients/nutricion/forms/Rec24hForm/steps/AlimentosStep'
import { REC24H_DEFAULTS } from '@features/patients/nutricion/forms/Rec24hForm/formDefaults'
import { REC24H_NUTRIENTES } from '@features/patients/nutricion/constants'
import {
  pickObjectives,
  serializeFoods,
  parseFoods,
  pickObjectivesFromRow,
} from '@features/patients/nutricion/forms/Rec24hForm/serialize'

const STEPS = ['Objetivos Nutricionales', 'Registro de Alimentos']
const STEPS_FIELDS = [[], []]
const STEP_COMPONENTS = [ObjetivosStep, AlimentosStep]
const OBJETIVO_NAMES = REC24H_NUTRIENTES.map((n) => n.objName)

function getCreateDefaults() {
  return { ...REC24H_DEFAULTS, fecha_eval: dayjs() }
}

function buildEditDefaults(rec) {
  return {
    ...fillDefaults(REC24H_DEFAULTS, pickObjectivesFromRow(rec)),
    comidas: parseFoods(rec?.rec_24h_comidas),
    fecha_eval: rec?.fecha_eval ? dayjs(rec.fecha_eval) : dayjs(),
  }
}

export default function Rec24hForm({
  historiaId,
  rec,
  initialStep = 0,
  editContext,
  onCloseModal,
}) {
  const { createRec, isCreating } = useCreateRec24h(historiaId)
  const { updateRec, isUpdating } = useUpdateRec24h(historiaId)
  const isEdit = !!rec
  const defaultValues = isEdit ? buildEditDefaults(rec) : getCreateDefaults()
  const stepForm = useStepForm(
    STEPS,
    STEPS_FIELDS,
    defaultValues,
    zodResolver(rec24hFormSchema),
    initialStep
  )
  const {
    currStep,
    methods: {
      formState: { isDirty },
    },
  } = stepForm

  const StepComponent = STEP_COMPONENTS[currStep]

  async function onSubmit(data) {
    const fechaStr = data.fecha_eval ? dayjs(data.fecha_eval).format('YYYY-MM-DD') : undefined

    if (isEdit) {
      const dirtyFields = stepForm.methods.formState.dirtyFields
      if (!Object.keys(dirtyFields).length) return onCloseModal?.()

      const payload = {}
      if (dirtyFields.fecha_eval) payload.fecha_eval = fechaStr
      if (OBJETIVO_NAMES.some((name) => dirtyFields[name])) {
        Object.assign(payload, nullifyEmpty(pickObjectives(data)))
      }
      // manyReplace: reenvía la lista completa (o [] para limpiarla). Se reenvía
      // también si cambió la fecha, para que cada alimento herede la nueva.
      if (dirtyFields.comidas || dirtyFields.fecha_eval) {
        payload.comidas = serializeFoods(data.comidas, fechaStr)
      }

      await updateRec({ id: rec.id, data: payload })
    } else {
      const comidas = serializeFoods(data.comidas, fechaStr)
      const payload = {
        historia_paciente_id: historiaId,
        ...(fechaStr && { fecha_eval: fechaStr }),
        ...omitEmpty(pickObjectives(data)),
        ...(comidas.length && { comidas }),
      }

      await createRec(payload)
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title={isEdit ? 'Editar Recordatorio de 24 h' : 'Nuevo Recordatorio de 24 h'}
      submitLabel={isEdit ? 'Actualizar recordatorio' : 'Guardar recordatorio'}
      steps={STEPS}
      onSubmit={onSubmit}
      isPending={isEdit ? isUpdating : isCreating}
      isEdit={isEdit}
      isDirty={isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent initialEditIndex={editContext?.foodIndex ?? null} />
    </StepFormShell>
  )
}
