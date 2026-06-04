import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicalPatientFormSchema } from '@schemas/medicalPatient'
import { useStepForm } from '@hooks/useStepForm'
import { pickDirty } from '@lib/utils'
import { useCreatePatientWithHistory } from '@features/patients/hooks/useCreatePatientWithHistory'
import { useCreateMedicalHistory } from '@features/patients/hooks/useCreateMedicalHistory'
import { useUpdatePatientWithHistory } from '@features/patients/hooks/useUpdatePatientWithHistory'
import StepFormShell from '@features/patients/forms/shared/StepFormShell'
import {
  CLONE_STEPS,
  CLONE_STEPS_FIELDS,
  CLONE_STEP_COMPONENTS,
  STEPS,
  STEPS_FIELDS,
  STEP_COMPONENTS,
  getDefaultValues,
} from '@features/patients/forms/MedicalPatientForm/formConfig'
import {
  buildEditDefaults,
  splitDirtyData,
  splitFormData,
} from '@features/patients/forms/MedicalPatientForm/formHelpers'
import { getFormCopy } from '@features/patients/forms/MedicalPatientForm/formCopy'

function resolveSteps({ patientOnly, skipPatientStep }) {
  if (patientOnly) return [[STEPS[0]], [STEPS_FIELDS[0]], [STEP_COMPONENTS[0]]]
  if (skipPatientStep) return [CLONE_STEPS, CLONE_STEPS_FIELDS, CLONE_STEP_COMPONENTS]
  return [STEPS, STEPS_FIELDS, STEP_COMPONENTS]
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

  const { register: registerPatient, isRegistering } = useCreatePatientWithHistory()
  const { createHistory, isCreating } = useCreateMedicalHistory()
  const { update: updatePatient, isUpdating } = useUpdatePatientWithHistory()

  const defaultValues = isEdit
    ? buildEditDefaults(patient, historia ?? {})
    : isClone
      ? { ...buildEditDefaults(patient, cloneHistoria), creado_at: dayjs() }
      : getDefaultValues()

  const skipPatientStep = isClone || (isEdit && historiaOnly)
  const [activeSteps, activeStepsFields, activeStepComponents] = resolveSteps({
    patientOnly,
    skipPatientStep,
  })

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
      const { patientData, historyData } = splitDirtyData(dirty, data)

      await updatePatient({
        patientId: patient.id,
        historyId: historia?.id,
        patientData,
        historyData,
      })
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
