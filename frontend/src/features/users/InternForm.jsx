import Button from '@components/Button'
import ModalBody from '@components/ModalBody'
import ModalActions from '@components/ModalActions'
import Stepper from '@components/Stepper'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider } from 'react-hook-form'
import { HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { useMemo } from 'react'
import { z } from 'zod'
import {
  internCreateSchema,
  internSelfRegisterBaseSchema,
} from '@cais/shared/schemas/users'
import { correoSchema, dayjsDateSchema } from '@cais/shared/schemas/fields'

const internSignupFormSchema = internSelfRegisterBaseSchema
  .omit({ token: true })
  .extend({ fechaNacimiento: dayjsDateSchema })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
import useCreateUser from './hooks/useCreateUser'
import useEmailDomain from '@hooks/useEmailDomain'
import { useStepForm } from '../../hooks/useStepForm'
import PasswordForm from './PasswordForm'
import RegistrationPasswordForm from './RegistrationPasswordForm'
import InterPersonalInfoForm from './InterPersonalInfoForm'
import InterAcademicInfoForm from './InterAcademicInfoForm'

const steps = ['Inf. Personal', 'Inf. Académica', 'Contraseña']

export default function InternForm({
  onClose,
  registration = false,
  email,
  onSubmit: externalOnSubmit,
  isPending = false,
}) {
  const { createUser, isCreating } = useCreateUser()
  const { isUabcDomain, setIsUabcDomain, resolveEmail } = useEmailDomain()

  const createFormSchema = useMemo(() => {
    const correoField = isUabcDomain
      ? z.string().min(1, 'Ingresa un usuario').max(255)
      : correoSchema
    return internCreateSchema
      .omit({ rol: true })
      .extend({ fechaNacimiento: dayjsDateSchema, correo: correoField })
  }, [isUabcDomain])

  const stepsFields = [
    ['nombre', 'apellido', 'fechaNacimiento', 'telefono'],
    [
      'correo',
      'matricula',
      'servicioInicioAnio',
      'servicioInicioPeriodo',
      'servicioFinAnio',
      'servicioFinPeriodo',
    ],
    registration ? ['password', 'confirmPassword'] : ['password'],
  ]

  const {
    currStep,
    setCurrStep,
    handleNext,
    handleStepClick,
    isLast,
    methods,
    handleSubmit,
    getFormKeyDown,
  } = useStepForm(
    steps,
    stepsFields,
    registration ? { correo: email } : {},
    zodResolver(registration ? internSignupFormSchema : createFormSchema)
  )

  const busy = registration ? isPending : isCreating

  function onSubmit(data) {
    if (registration) {
      externalOnSubmit({
        nombre: data.nombre,
        apellido: data.apellido,
        fechaNacimiento: data.fechaNacimiento,
        telefono: data.telefono,
        matricula: data.matricula,
        servicioInicioAnio: data.servicioInicioAnio,
        servicioInicioPeriodo: data.servicioInicioPeriodo,
        servicioFinAnio: data.servicioFinAnio,
        servicioFinPeriodo: data.servicioFinPeriodo,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
    } else {
      createUser(
        {
          nombre: data.nombre,
          apellido: data.apellido,
          correo: resolveEmail(data.correo),
          fechaNacimiento: data.fechaNacimiento,
          telefono: data.telefono,
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
  }

  const PasswordComponent = registration
    ? RegistrationPasswordForm
    : PasswordForm

  const nav = registration ? (
    <div className="mt-8 flex gap-3">
      {currStep > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrStep((p) => p - 1)}
          className="flex-[30%]"
          disabled={busy}
        >
          <HiChevronLeft strokeWidth={1} />
          Anterior
        </Button>
      )}
      <Button
        type="button"
        variant="primary"
        onClick={isLast ? handleSubmit(onSubmit) : handleNext}
        className={currStep === 0 ? 'w-full' : 'flex-[70%]'}
        isLoading={busy}
        disabled={busy}
      >
        {isLast && <HiCheck strokeWidth={1} />}
        {isLast ? 'Registrarme' : 'Siguiente'}
        {!isLast && <HiChevronRight strokeWidth={1} />}
      </Button>
    </div>
  ) : (
    <ModalActions
      onClose={onClose}
      primaryAction={{
        label: isLast ? 'Crear usuario' : 'Siguiente',
        icon: isLast ? (
          <HiCheck strokeWidth={1} />
        ) : (
          <HiChevronRight strokeWidth={1} />
        ),
        iconPos: isLast ? 'left' : 'right',
        onClick: isLast ? handleSubmit(onSubmit) : handleNext,
        isLoading: busy,
        disabled: busy,
      }}
      secondaryAction={{
        label: 'Anterior',
        onClick: () => setCurrStep((p) => p - 1),
        disabled: currStep === 0 || busy,
        className: 'border-gray-400',
      }}
    />
  )

  const content = (
    <>
      <Stepper steps={steps} current={currStep} setCurrStep={handleStepClick} />
      <form className="mt-6" onKeyDown={getFormKeyDown(onSubmit, busy)}>
        {currStep === 0 && <InterPersonalInfoForm />}
        {currStep === 1 && (
          <InterAcademicInfoForm
            disabledEmail={registration ? email : undefined}
            isUabcDomain={isUabcDomain}
            setIsUabcDomain={setIsUabcDomain}
          />
        )}
        {currStep === 2 && <PasswordComponent />}
      </form>
    </>
  )

  return (
    <FormProvider {...methods}>
      {registration ? (
        <div>{content}</div>
      ) : (
        <ModalBody py={6}>{content}</ModalBody>
      )}
      {nav}
    </FormProvider>
  )
}
