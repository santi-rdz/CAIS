import { zodResolver } from '@hookform/resolvers/zod'
import { nutritionalPatientFormSchema } from '@schemas/nutritionalPatient'
import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import {
  DEFAULT_VALUES,
  STEPS,
  STEPS_FIELDS,
  STEP_COMPONENTS,
} from '@features/patients/nutricion/forms/NutritionalPatientForm/formConfig'

const resolver = zodResolver(nutritionalPatientFormSchema)

export default function NutritionalPatientForm({ onCloseModal }) {
  const stepForm = useStepForm(STEPS, STEPS_FIELDS, DEFAULT_VALUES, resolver)
  const { currStep, methods } = stepForm
  const StepComponent = STEP_COMPONENTS[currStep]

  async function onSubmit(_data) {
    // TODO: conectar con backend (crear paciente + historia nutrición)
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title="Registro de Nuevo Paciente"
      submitLabel="Registrar paciente"
      steps={STEPS}
      onSubmit={onSubmit}
      isPending={false}
      isEdit={false}
      isDirty={methods.formState.isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent />
    </StepFormShell>
  )
}
