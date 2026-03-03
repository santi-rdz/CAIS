import Button from '@ui/Button'
import Stepper from '@ui/Stepper'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { registroUsuario } from '@services/ApiUsers'
import { toast } from 'sonner'
import { toastApiError } from '@lib/ApiError'
import AcademicInfoForm from './AcademicInfoForm'
import PersonalInfoForm from './PersonalInfoForm'
import RegistrationPasswordForm from './RegistrationPasswordForm'

const steps = ['Información Personal', 'Información Académica', 'Contraseña']

const stepsFields = [
  ['firstName', 'lastName', 'birthday', 'phone'],
  ['username', 'matricula', 'servicioInicioAnio', 'servicioInicioPeriodo', 'servicioFinAnio', 'servicioFinPeriodo'],
  ['password', 'confirmPassword'],
]

export default function InternRegistrationForm({ email }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [currStep, setCurrStep] = useState(0)
  const methods = useForm({ mode: 'onChange', defaultValues: { username: email } })
  const { trigger, handleSubmit } = methods

  const isFirst = currStep === 0
  const isLast = currStep === steps.length - 1

  const { mutate, isPending } = useMutation({
    mutationFn: registroUsuario,
    onSuccess: () => {
      toast.success('Registro completado exitosamente')
      navigate('/login')
    },
    onError: toastApiError,
  })

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
    mutate({
      token,
      nombre: data.firstName,
      apellido: data.lastName,
      fechaNacimiento: data.birthday,
      telefono: data.phone,
      matricula: data.matricula,
      servicioInicioAnio: data.servicioInicioAnio,
      servicioInicioPeriodo: data.servicioInicioPeriodo,
      servicioFinAnio: data.servicioFinAnio,
      servicioFinPeriodo: data.servicioFinPeriodo,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
  }

  return (
    <div className="space-y-8">
      <Stepper steps={steps} current={currStep} setCurrStep={handleStepClick} />
      <FormProvider {...methods}>
        <form className="mt-12 space-y-6">
          {currStep === 0 && <PersonalInfoForm />}
          {currStep === 1 && <AcademicInfoForm disabledEmail={email} />}
          {currStep === 2 && <RegistrationPasswordForm />}
        </form>

        <div className="mt-6 flex gap-3">
          {!isFirst && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrStep((p) => p - 1)}
              className="flex-[30%]"
              icon={<HiChevronLeft strokeWidth={1} />}
              iconPos="left"
              disabled={isPending}
            >
              Anterior
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            onClick={isLast ? handleSubmit(onSubmit) : handleNext}
            className={isFirst ? 'w-full' : 'flex-[70%]'}
            icon={isLast ? <HiCheck strokeWidth={1} /> : <HiChevronRight strokeWidth={1} />}
            iconPos={isLast ? 'left' : 'right'}
            isLoading={isPending}
            disabled={isPending}
          >
            {isLast ? 'Registrarme' : 'Siguiente'}
          </Button>
        </div>
      </FormProvider>
    </div>
  )
}
