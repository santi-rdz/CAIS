import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { biochemicalEvalFormSchema } from '@schemas/biochemicalEval'
import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import { omitEmpty, pickDirty, nullifyEmpty, fillDefaults } from '@lib/utils'
import { useCreateBiochemicalEval } from '@features/patients/nutricion/hooks/useCreateBiochemicalEval'
import { useUpdateBiochemicalEval } from '@features/patients/nutricion/hooks/useUpdateBiochemicalEval'
import HematologiaEndocrinoStep from '@features/patients/nutricion/forms/EvalBioquimicaForm/steps/HematologiaEndocrinoStep'
import PerfilRenalStep from '@features/patients/nutricion/forms/EvalBioquimicaForm/steps/PerfilRenalStep'
import LipidosAcidoBaseStep from '@features/patients/nutricion/forms/EvalBioquimicaForm/steps/LipidosAcidoBaseStep'
import PerfilOrinaStep from '@features/patients/nutricion/forms/EvalBioquimicaForm/steps/PerfilOrinaStep'
import EstadoInflamatorioStep from '@features/patients/nutricion/forms/EvalBioquimicaForm/steps/EstadoInflamatorioStep'
import {
  PERFIL_ANEMIA_DEFAULTS,
  PERFIL_ENDOCRINO_DEFAULTS,
  PERFIL_RENAL_ELECTROLITOS_DEFAULTS,
  PERFIL_LIPIDOS_DEFAULTS,
  BALANCE_ACIDO_BASE_DEFAULTS,
  PERFIL_ORINA_DEFAULTS,
  PERFIL_INFLAMATORIO_DEFAULTS,
  EVAL_ESTADO_NUTRICION_DEFAULTS,
} from '@features/patients/nutricion/forms/EvalBioquimicaForm/formDefaults'
import {
  PERFIL_ANEMIA_FIELDS,
  PERFIL_ENDOCRINO_FIELDS,
  PERFIL_RENAL_FIELDS,
  PERFIL_LIPIDOS_FIELDS,
  BALANCE_ACIDO_BASE_FIELDS,
  PERFIL_ORINA_FIELDS,
  PERFIL_INFLAMATORIO_Y_NUTRICION_FIELDS,
} from '@features/patients/nutricion/forms/EvalBioquimicaForm/fieldConfig'

const STEPS = [
  'Hematología y Endócrino',
  'Perfil Renal',
  'Lípidos y Ácido-Base',
  'Perfil de Orina',
  'Estado Inflamatorio',
]

// Traduce la config declarativa de cada step a los field paths que useStepForm
// necesita para validar SOLO ese step antes de avanzar (si no, trigger([])
// no valida nada y se puede navegar con datos inválidos hasta el submit final).
function fieldPaths(fields, prefix) {
  return fields.map((f) => `${f.prefix ?? prefix}.${f.name}`)
}

const STEPS_FIELDS = [
  [
    ...fieldPaths(PERFIL_ANEMIA_FIELDS, 'perfil_anemia_nutricion'),
    ...fieldPaths(PERFIL_ENDOCRINO_FIELDS, 'perfil_endocrino'),
  ],
  fieldPaths(PERFIL_RENAL_FIELDS, 'perfil_renal_electrolitos'),
  [
    ...fieldPaths(PERFIL_LIPIDOS_FIELDS, 'perfil_lipidos'),
    ...fieldPaths(BALANCE_ACIDO_BASE_FIELDS, 'balance_acido_base'),
  ],
  fieldPaths(PERFIL_ORINA_FIELDS, 'perfil_orina'),
  fieldPaths(PERFIL_INFLAMATORIO_Y_NUTRICION_FIELDS),
]

const STEP_COMPONENTS = [
  HematologiaEndocrinoStep,
  PerfilRenalStep,
  LipidosAcidoBaseStep,
  PerfilOrinaStep,
  EstadoInflamatorioStep,
]

// Los 8 sub-perfiles 1:1 de eval_bioq_nutricion. Todos opcionales en el schema
// compartido — el payload solo manda los que el usuario llenó.
const NESTED_KEYS = [
  'perfil_anemia_nutricion',
  'perfil_endocrino',
  'perfil_renal_electrolitos',
  'perfil_lipidos',
  'balance_acido_base',
  'perfil_orina',
  'perfil_inflamatorio',
  'eval_estado_nutricion',
]

const DEFAULT_VALUES_TEMPLATE = {
  perfil_anemia_nutricion: PERFIL_ANEMIA_DEFAULTS,
  perfil_endocrino: PERFIL_ENDOCRINO_DEFAULTS,
  perfil_renal_electrolitos: PERFIL_RENAL_ELECTROLITOS_DEFAULTS,
  perfil_lipidos: PERFIL_LIPIDOS_DEFAULTS,
  balance_acido_base: BALANCE_ACIDO_BASE_DEFAULTS,
  perfil_orina: PERFIL_ORINA_DEFAULTS,
  perfil_inflamatorio: PERFIL_INFLAMATORIO_DEFAULTS,
  eval_estado_nutricion: EVAL_ESTADO_NUTRICION_DEFAULTS,
}

function getCreateDefaults() {
  return { ...DEFAULT_VALUES_TEMPLATE, fecha: dayjs() }
}

function buildEditDefaults(evaluation) {
  return {
    ...fillDefaults(DEFAULT_VALUES_TEMPLATE, evaluation),
    fecha: evaluation?.fecha ? dayjs(evaluation.fecha) : dayjs(),
  }
}

// Arma el payload de creación solo con los sub-perfiles que el usuario llenó
// (el resto queda fuera del body en vez de mandarse vacío).
function buildNestedPayload(cleaned) {
  return Object.fromEntries(
    NESTED_KEYS.filter((key) => cleaned[key]).map((key) => [key, cleaned[key]])
  )
}

export default function EvalBioquimicaForm({
  historiaId,
  evaluation,
  initialStep = 0,
  onCloseModal,
}) {
  const { createEval, isCreating } = useCreateBiochemicalEval(historiaId)
  const { updateEval, isUpdating } = useUpdateBiochemicalEval(historiaId)
  const isEdit = !!evaluation
  const defaultValues = isEdit ? buildEditDefaults(evaluation) : getCreateDefaults()
  const stepForm = useStepForm(
    STEPS,
    STEPS_FIELDS,
    defaultValues,
    zodResolver(biochemicalEvalFormSchema),
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
        if (key in dirty) {
          dirty[key] = nullifyEmpty(data[key])
        }
      }

      const payload = {
        ...nullifyEmpty(dirty),
        ...(dirty.fecha && { fecha: dayjs(data.fecha).format('YYYY-MM-DD') }),
      }

      await updateEval({ id: evaluation.id, data: payload })
    } else {
      const cleaned = omitEmpty(data)
      const payload = {
        historia_paciente_id: historiaId,
        ...(data.fecha && { fecha: dayjs(data.fecha).format('YYYY-MM-DD') }),
        ...buildNestedPayload(cleaned),
      }

      await createEval(payload)
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title={isEdit ? 'Editar Evaluación Bioquímica' : 'Nueva Evaluación Bioquímica'}
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
