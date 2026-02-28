import DatePickerButton from '@ui/DatePickerButton'
import FormRow from '@ui/FormRow'
import Input from '@ui/Input'
import ModalActions from '@ui/ModalActions'
import Row from '@ui/Row'
import { useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { HiCheck, HiChevronRight } from 'react-icons/hi2'

const steps = ['Información Personal', 'Información Académica', 'Confirmación']

export default function InternForm() {
  const [currStep, setCurrStep] = useState(0)
  const methods = useForm()
  const { trigger, handleSubmit } = methods
  const isLast = currStep === steps.length - 1

  const stepsFields = [['firstName', 'lastName', 'birthday', 'phone']]

  async function handleNext() {
    const isStepValid = await trigger(stepsFields[currStep])
    if (isStepValid) setCurrStep((p) => p + 1)
  }
  return (
    <section className="">
      <FormProvider {...methods}>
        <div className="p-8 pb-12">
          <Stepper steps={steps} current={currStep} setCurrStep={setCurrStep} />
          <form action="" className="mt-16">
            {currStep === 0 && <PersonalInfoForm />}
          </form>
        </div>
        <ModalActions
          primaryAction={{
            label: isLast ? 'Crear usuario' : 'Siguiente',
            icon: isLast ? <HiCheck strokeWidth={1} /> : <HiChevronRight strokeWidth={1} />,
            iconPos: isLast ? 'left' : 'right',
            onClick: isLast ? () => {} : handleNext,
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

function Stepper({ steps, current, setCurrStep, gap = '' }) {
  return (
    <div className="mx-4 flex" style={{ gap }}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const isCompleted = current > i
        const isActive = current === i
        return (
          <div key={i} className={`flex flex-1 items-center ${isLast ? 'grow-0' : ''}`} style={{ gap }}>
            <div className="relative">
              <button
                onClick={() => setCurrStep(i)}
                className={`flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform ${isActive ? 'scale-105 ring-2 ring-green-800 ring-offset-2' : ''} ${isActive || isCompleted ? 'bg-green-800 text-white' : 'bg-gray-200 text-neutral-500'}`}
              >
                {isCompleted ? <HiCheck strokeWidth={1} /> : i + 1}
              </button>
              <p
                className={`text-6 absolute left-1/2 mt-2 max-w-[10ch] -translate-x-1/2 text-center text-wrap text-gray-500 ${isActive || isCompleted ? 'text-green-800' : ''}`}
              >
                {step}
              </p>
            </div>
            {!isLast && (
              <div
                className={`h-1 w-full transition-colors duration-500 ease-in-out ${isCompleted ? 'bg-green-800' : 'bg-gray-200'} `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function PersonalInfoForm() {
  const { register, formState } = useFormContext()
  const { errors } = formState
  return (
    <div>
      <Row className="gap-4">
        <FormRow htmlFor="firstName" label="Nombre(s)" className="w-full">
          <Input
            {...register('firstName', {
              required: 'Ingresa el nombre del pasante',
            })}
            id="firstName"
            type="text"
            name="firstName"
            placeholder="Ej. Juan Carlos"
            hasError={errors?.firstName?.message}
            variant="outline"
          />
        </FormRow>
        <FormRow htmlFor="lastName" label="Apellidos" className="w-full">
          <Input
            {...register('lastName', {
              required: 'Ingresa apellidos del pasante',
            })}
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Ej. Perez Lopez"
            hasError={errors?.lastName?.message}
            variant="outline"
          />
        </FormRow>
        <DatePickerButton />
      </Row>
    </div>
  )
}
