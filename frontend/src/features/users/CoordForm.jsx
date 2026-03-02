import ModalActions from '@ui/ModalActions'
import Stepper from '@ui/Stepper'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { HiCheck, HiChevronRight } from 'react-icons/hi2'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@services/ApiUsers'
import { toast } from 'sonner'
import CoordPersonalInfoForm from './CoordPersonalInfoForm'
import PasswordForm from './PasswordForm'

const steps = ['Información Personal', 'Contraseña']

const stepsFields = [
  ['firstName', 'lastName', 'email', 'birthday', 'phone', 'cedula'],
  ['password'],
]

export default function CoordForm({ onClose }) {
  const queryClient = useQueryClient()
  const [currStep, setCurrStep] = useState(0)
  const methods = useForm({ mode: 'onChange' })
  const { trigger, handleSubmit } = methods
  const isLast = currStep === steps.length - 1

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('Usuario creado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose?.()
    },
    onError: (err) => {
      toast.error(err.message)
    },
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
      nombre: data.firstName,
      apellido: data.lastName,
      correo: data.email,
      fechaNacimiento: data.birthday,
      telefono: data.phone,
      rol: 'coordinador',
      cedula: data.cedula,
      password: data.password,
    })
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <FormProvider {...methods}>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-10">
          <Stepper steps={steps} current={currStep} setCurrStep={handleStepClick} />
          <form action="" className="mt-20">
            {currStep === 0 && <CoordPersonalInfoForm />}
            {currStep === 1 && <PasswordForm />}
          </form>
        </div>
        <ModalActions
          primaryAction={{
            label: isLast ? 'Crear usuario' : 'Siguiente',
            icon: isLast ? <HiCheck strokeWidth={1} /> : <HiChevronRight strokeWidth={1} />,
            iconPos: isLast ? 'left' : 'right',
            onClick: isLast ? handleSubmit(onSubmit) : handleNext,
            isLoading: isPending,
            disabled: isPending,
          }}
          secondaryAction={{
            label: 'Anterior',
            onClick: () => setCurrStep((p) => p - 1),
            disabled: currStep === 0 || isPending,
            className: 'border-gray-400',
          }}
        />
      </FormProvider>
    </section>
  )
}
