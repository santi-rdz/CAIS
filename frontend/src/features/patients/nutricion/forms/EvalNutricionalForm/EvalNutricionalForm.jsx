import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { nutritionalEvalFormSchema } from '@schemas/nutritionalEval'
import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import { omitEmpty, pickDirty, nullifyEmpty, fillDefaults } from '@lib/utils'
import { useCreateNutritionalEval } from '@features/patients/nutricion/hooks/useCreateNutritionalEval'
import { useUpdateNutritionalEval } from '@features/patients/nutricion/hooks/useUpdateNutritionalEval'
import DietaHabitosStep from '@features/patients/nutricion/forms/EvalNutricionalForm/steps/DietaHabitosStep'
import ApetitoStep from '@features/patients/nutricion/forms/EvalNutricionalForm/steps/ApetitoStep'
import FrecuenciaConsumoStep from '@features/patients/nutricion/forms/EvalNutricionalForm/steps/FrecuenciaConsumoStep'
import PreferenciasStep from '@features/patients/nutricion/forms/EvalNutricionalForm/steps/PreferenciasStep'
import { NUTRICIONAL_DEFAULTS } from '@features/patients/nutricion/forms/EvalNutricionalForm/formDefaults'
import { HORARIO_TIME_FIELDS } from '@features/patients/nutricion/forms/EvalNutricionalForm/fieldConfig'
import {
  serializeHorarios,
  serializeApetito,
  apetitoHasValues,
  parseTimeToDayjs,
} from '@features/patients/nutricion/forms/EvalNutricionalForm/serialize'

const STEPS = [
  'Dieta y Hábitos',
  'Evaluación de Apetito',
  'Frecuencia de Consumo',
  'Preferencias Alimentarias',
]

// Todos los campos son opcionales en el schema compartido, así que no se valida
// por-paso: se puede avanzar libremente y el submit final arma solo lo llenado.
const STEPS_FIELDS = [[], [], [], []]

const STEP_COMPONENTS = [DietaHabitosStep, ApetitoStep, FrecuenciaConsumoStep, PreferenciasStep]

const NESTED_KEYS = [
  'horarios_comida_nutricion',
  'eval_apetito_nutricion',
  'frec_consumo_alimentos_nutricion',
]

function getCreateDefaults() {
  return { ...NUTRICIONAL_DEFAULTS, fecha: dayjs() }
}

function buildEditDefaults(evaluation) {
  const filled = fillDefaults(NUTRICIONAL_DEFAULTS, evaluation)
  const horarios = { ...filled.horarios_comida_nutricion }
  for (const { name } of HORARIO_TIME_FIELDS) {
    horarios[name] = parseTimeToDayjs(evaluation?.horarios_comida_nutricion?.[name])
  }
  return {
    ...filled,
    horarios_comida_nutricion: horarios,
    fecha: evaluation?.fecha ? dayjs(evaluation.fecha) : dayjs(),
  }
}

// Serializa un grupo anidado para el wire (horas → string, apetito + puntaje).
function serializeGroup(key, value) {
  if (key === 'horarios_comida_nutricion') return serializeHorarios(value)
  if (key === 'eval_apetito_nutricion') return serializeApetito(value)
  return value
}

export default function EvalNutricionalForm({
  historiaId,
  evaluation,
  initialStep = 0,
  onCloseModal,
}) {
  const { createEval, isCreating } = useCreateNutritionalEval(historiaId)
  const { updateEval, isUpdating } = useUpdateNutritionalEval(historiaId)
  const isEdit = !!evaluation
  const defaultValues = isEdit ? buildEditDefaults(evaluation) : getCreateDefaults()
  const stepForm = useStepForm(
    STEPS,
    STEPS_FIELDS,
    defaultValues,
    zodResolver(nutritionalEvalFormSchema),
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
    if (isEdit) {
      const dirtyFields = stepForm.methods.formState.dirtyFields
      if (!Object.keys(dirtyFields).length) return onCloseModal?.()

      const dirty = pickDirty(data, dirtyFields)
      for (const key of NESTED_KEYS) {
        if (!(key in dirty)) continue
        // Mismo criterio que el create: no persistir un bloque de apetito sin
        // respuestas (quedaría un registro con puntaje 0 y sin clasificación).
        // Se omite del payload; el backend deja intacto el registro existente.
        if (key === 'eval_apetito_nutricion' && !apetitoHasValues(data[key])) {
          delete dirty[key]
          continue
        }
        dirty[key] = nullifyEmpty(serializeGroup(key, data[key]))
      }

      const payload = {
        ...nullifyEmpty(dirty),
        ...(dirty.fecha && { fecha: dayjs(data.fecha).format('YYYY-MM-DD') }),
      }

      await updateEval({ id: evaluation.id, data: payload })
    } else {
      const groups = {}
      const horarios = serializeHorarios(data.horarios_comida_nutricion)
      if (horarios) groups.horarios_comida_nutricion = horarios
      if (apetitoHasValues(data.eval_apetito_nutricion)) {
        groups.eval_apetito_nutricion = serializeApetito(data.eval_apetito_nutricion)
      }
      groups.frec_consumo_alimentos_nutricion = data.frec_consumo_alimentos_nutricion

      const cleaned = omitEmpty({
        sigue_dieta: data.sigue_dieta,
        tiene_alergia: data.tiene_alergia,
        cual_alergia: data.cual_alergia,
        alimentos_disgusta: data.alimentos_disgusta,
        ...groups,
      })

      const payload = {
        historia_paciente_id: historiaId,
        ...(data.fecha && { fecha: dayjs(data.fecha).format('YYYY-MM-DD') }),
        ...cleaned,
      }

      await createEval(payload)
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title={isEdit ? 'Editar Evaluación Nutricional' : 'Nueva Evaluación Nutricional'}
      submitLabel={isEdit ? 'Actualizar evaluación' : 'Guardar evaluación'}
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
