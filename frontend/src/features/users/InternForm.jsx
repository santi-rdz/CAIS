import ModalActions from '@ui/ModalActions'
import Stepper from '@ui/Stepper'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { HiCheck, HiChevronRight } from 'react-icons/hi2'
import useCreateUser from './useCreateUser'
import useEmailDomain from '@hooks/useEmailDomain'
import AcademicInfoForm from './AcademicInfoForm'
import PasswordForm from './PasswordForm'
import PersonalInfoForm from './PersonalInfoForm'

const steps = ['Información Personal', 'Información Académica', 'Contraseña']

const stepsFields = [
  ['firstName', 'lastName', 'birthday', 'phone'],
  [
    'username',
    'matricula',
    'servicioInicioAnio',
    'servicioInicioPeriodo',
    'servicioFinAnio',
    'servicioFinPeriodo',
  ],
  ['password'],
]

export default function InternForm({ onClose }) {
  const { createUser, isCreating } = useCreateUser()
  const [currStep, setCurrStep] = useState(0)
  const { isUabcDomain, setIsUabcDomain, resolveEmail } = useEmailDomain()
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

  function onSubmit(data) {
    createUser(
      {
        nombre: data.firstName,
        apellido: data.lastName,
        correo: resolveEmail(data.username),
        fechaNacimiento: data.birthday,
        telefono: data.phone,
        rol: 'pasante',
        matricula: data.matricula,
        servicioInicioAnio: data.servicioInicioAnio,
        servicioInicioPeriodo: data.servicioInicioPeriodo,
        servicioFinAnio: data.servicioFinAnio,
        servicioFinPeriodo: data.servicioFinPeriodo,
        password: data.password,
      },
      { onSuccess: () => onClose?.() }
    )
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <FormProvider {...methods}>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-10">
          <Stepper
            steps={steps}
            current={currStep}
            setCurrStep={handleStepClick}
          />
          <form action="" className="mt-20">
            {currStep === 0 && <PersonalInfoForm />}
            {currStep === 1 && (
              <AcademicInfoForm
                isUabcDomain={isUabcDomain}
                setIsUabcDomain={setIsUabcDomain}
              />
            )}
            {currStep === 2 && <PasswordForm />}
          </form>
        </div>
        <ModalActions
          primaryAction={{
            label: isLast ? 'Crear usuario' : 'Siguiente',
            icon: isLast ? (
              <HiCheck strokeWidth={1} />
            ) : (
              <HiChevronRight strokeWidth={1} />
            ),
            iconPos: isLast ? 'left' : 'right',
            onClick: isLast ? handleSubmit(onSubmit) : handleNext,
            isLoading: isCreating,
            disabled: isCreating,
          }}
          secondaryAction={{
            label: 'Anterior',
            onClick: () => setCurrStep((p) => p - 1),
            disabled: currStep === 0 || isCreating,
            className: 'border-gray-400',
          }}
        />
      </FormProvider>
    </section>
  )
}
