import { zodResolver } from '@hookform/resolvers/zod'
import { nutritionalPatientFormSchema } from '@schemas/nutritionalPatient'
import { useStepForm } from '@hooks/useStepForm'
import { useCreatePatientWithNutritionHistory } from '@features/patients/nutricion/hooks/useCreatePatientWithNutritionHistory'
import { useCreateNutritionHistory } from '@features/patients/nutricion/hooks/useCreateNutritionHistory'
import { useUpdatePatientWithNutritionHistory } from '@features/patients/nutricion/hooks/useUpdatePatientWithNutritionHistory'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import {
  getDefaultValues,
  STEPS,
  STEPS_FIELDS,
  STEP_COMPONENTS,
  HISTORIA_STEPS,
  HISTORIA_STEPS_FIELDS,
  HISTORIA_STEP_COMPONENTS,
  EDIT_HISTORIA_STEPS,
  EDIT_HISTORIA_STEPS_FIELDS,
  EDIT_HISTORIA_STEP_COMPONENTS,
} from '@features/patients/nutricion/forms/NutritionalPatientForm/formConfig'
import { pickDirty } from '@lib/utils'
import {
  buildEditDefaults,
  buildHistoryUpdate,
  splitDirtyData,
  splitFormData,
} from '@features/patients/nutricion/forms/NutritionalPatientForm/formHelpers'
import { getFormCopy } from '@features/patients/nutricion/forms/NutritionalPatientForm/formCopy'

const resolver = zodResolver(nutritionalPatientFormSchema)

function resolveSteps({ patientOnly, skipPatientStep, historiaOnly }) {
  if (patientOnly) return [[STEPS[0]], [STEPS_FIELDS[0]], [STEP_COMPONENTS[0]]]
  if (historiaOnly)
    return [EDIT_HISTORIA_STEPS, EDIT_HISTORIA_STEPS_FIELDS, EDIT_HISTORIA_STEP_COMPONENTS]
  if (skipPatientStep) return [HISTORIA_STEPS, HISTORIA_STEPS_FIELDS, HISTORIA_STEP_COMPONENTS]
  return [STEPS, STEPS_FIELDS, STEP_COMPONENTS]
}

export default function NutritionalPatientForm({
  onCloseModal,
  patient,
  historia,
  cloneHistoria,
  onCreated,
  historiaOnly = false,
  patientOnly = false,
  initialStep = 0,
}) {
  const isEdit = !!patient && (!!historia || patientOnly)
  const isClone = !isEdit && !!patient && !!cloneHistoria

  const { register: registerPatient, isRegistering } = useCreatePatientWithNutritionHistory()
  const { createHistory, isCreating } = useCreateNutritionHistory()
  const { update, isUpdating } = useUpdatePatientWithNutritionHistory()

  const defaultValues = isEdit
    ? buildEditDefaults(patient, historia ?? {}, { patientOnly })
    : isClone
      ? buildEditDefaults(patient, cloneHistoria, { skipMonitoring: true })
      : getDefaultValues()

  const skipPatientStep = isClone || (isEdit && historiaOnly)
  const [activeSteps, activeStepsFields, activeStepComponents] = resolveSteps({
    patientOnly,
    skipPatientStep,
    historiaOnly: isEdit && historiaOnly,
  })

  const startStep = Math.min(initialStep, activeSteps.length - 1)
  const stepForm = useStepForm(activeSteps, activeStepsFields, defaultValues, resolver, startStep)
  const { currStep, methods } = stepForm
  const { isDirty } = methods.formState
  const StepComponent = activeStepComponents[currStep]

  async function onSubmit(data) {
    if (isEdit) {
      if (!isDirty) return onCloseModal?.()

      if (patientOnly) {
        // Editar datos personales también permite cambiar motivo_consulta; si
        // solo cambia ese campo, update recibe historyData sin patientData.
        const dirty = pickDirty(data, methods.formState.dirtyFields)
        const { patientData, historyData } = splitDirtyData(dirty, data)
        await update({ patientId: patient.id, historyId: historia?.id, patientData, historyData })
      } else {
        // Edición de historia: reemplaza las 3 secciones clínicas completas.
        await update({
          patientId: patient.id,
          historyId: historia.id,
          patientData: null,
          historyData: buildHistoryUpdate(data),
        })
      }
    } else if (isClone) {
      const { historyData } = splitFormData(data)
      const result = await createHistory({ pacienteId: patient.id, historyData })
      onCreated?.(result?.history?.id)
    } else {
      const { patientData, historyData } = splitFormData(data)
      await registerPatient({ patientData, historyData })
    }
    onCloseModal?.()
  }

  const copy = getFormCopy({
    isEdit,
    isClone,
    historiaOnly,
    patientOnly,
    historia,
    cloneHistoria,
  })

  return (
    <StepFormShell
      title={copy.title}
      subtitle={copy.subtitle}
      description={copy.description}
      submitLabel={copy.submitLabel}
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
