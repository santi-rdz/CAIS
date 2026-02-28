import ModalActions from '@ui/ModalActions'
import Stepper from '@ui/Stepper'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { HiCheck, HiChevronRight } from 'react-icons/hi2'
import AcademicInfoForm from './AcademicInfoForm'
import PasswordForm from './PasswordForm'
import PersonalInfoForm from './PersonalInfoForm'

const steps = ['Información Personal', 'Información Académica', 'Contraseña']

const stepsFields = [
  ['firstName', 'lastName', 'birthday', 'phone'],
  ['username', 'matricula', 'servicioInicioAnio', 'servicioInicioPeriodo', 'servicioFinAnio', 'servicioFinPeriodo'],
  ['password', 'confirmPassword'],
]

export default function InternForm() {
  const [currStep, setCurrStep] = useState(1)
  const methods = useForm({ mode: 'onChange' })
  const { trigger, handleSubmit } = methods
  const isLast = currStep === steps.length - 1

  async function handleNext() {
    const isStepValid = await trigger(stepsFields[currStep])
    if (isStepValid) setCurrStep((p) => p + 1)
  }

  async function handleStepClick(i) {
    if (i <= currStep) {
      setCurrStep(i)
      return
    }
    for (let step = currStep; step < i; step++) {
      const isValid = await trigger(stepsFields[step])
      if (!isValid) return
    }
    setCurrStep(i)
  }

  return (
    <section className="flex flex-col flex-1 min-h-0">
      <FormProvider {...methods}>
        <div className="flex-1 min-h-0 overflow-y-auto p-8">
          <Stepper steps={steps} current={currStep} setCurrStep={handleStepClick} />
          <form action="" className="mt-16">
            {currStep === 0 && <PersonalInfoForm />}
            {currStep === 1 && <AcademicInfoForm />}
            {currStep === 2 && <PasswordForm />}
          </form>
        </div>
        <ModalActions
          primaryAction={{
            label: isLast ? 'Crear usuario' : 'Siguiente',
            icon: isLast ? <HiCheck strokeWidth={1} /> : <HiChevronRight strokeWidth={1} />,
            iconPos: isLast ? 'left' : 'right',
            onClick: isLast ? handleSubmit(() => {}) : handleNext,
          }}
          secondaryAction={{
            label: 'Anterior',
            onClick: () => setCurrStep((p) => p - 1),
            disabled: currStep === 0,
            className: 'border-gray-400',
          }}
        />
      </FormProvider>
    </section>
  )
}
