import { zodResolver } from '@hookform/resolvers/zod'
import { nutritionalPatientFormSchema } from '@schemas/nutritionalPatient'
import { useStepForm } from '@hooks/useStepForm'
import { useCreatePatientWithNutritionHistory } from '@features/patients/nutricion/hooks/useCreatePatientWithNutritionHistory'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import {
  DEFAULT_VALUES,
  STEPS,
  STEPS_FIELDS,
  STEP_COMPONENTS,
} from '@features/patients/nutricion/forms/NutritionalPatientForm/formConfig'
import { splitFormData } from '@features/patients/nutricion/forms/NutritionalPatientForm/formHelpers'

const resolver = zodResolver(nutritionalPatientFormSchema)

export default function NutritionalPatientForm({ onCloseModal }) {
  const stepForm = useStepForm(STEPS, STEPS_FIELDS, DEFAULT_VALUES, resolver)
  const { currStep, methods } = stepForm
  const StepComponent = STEP_COMPONENTS[currStep]

  const { register, isRegistering } = useCreatePatientWithNutritionHistory()

  async function onSubmit(data) {
    const { patientData, historyData } = splitFormData(data)
    await register({ patientData, historyData })
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title="Registro de Nuevo Paciente"
      submitLabel="Registrar paciente"
      steps={STEPS}
      onSubmit={onSubmit}
      isPending={isRegistering}
      isEdit={false}
      isDirty={methods.formState.isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent />
    </StepFormShell>
  )
}
