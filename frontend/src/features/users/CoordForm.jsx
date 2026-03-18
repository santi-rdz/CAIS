import Button from '@components/Button'
import ModalActions from '@components/ModalActions'
import Stepper from '@components/Stepper'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider } from 'react-hook-form'
import { HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import {
  coordCreateFormSchema,
  coordSignupFormSchema,
} from '@cais/shared/schemas/users'
import useCreateUser from './hooks/useCreateUser'
import useEmailDomain from '@hooks/useEmailDomain'
import { useStepForm } from '../../hooks/useStepForm'
import CoordPersonalInfoForm from './CoordPersonalInfoForm'
import PasswordForm from './PasswordForm'
import RegistrationPasswordForm from './RegistrationPasswordForm'

const steps = ['Información Personal', 'Contraseña']

export default function CoordForm({
  onClose,
  registration = false,
  email,
  onSubmit: externalOnSubmit,
  isPending = false,
}) {
  const { createUser, isCreating } = useCreateUser()
  const { isUabcDomain, setIsUabcDomain, resolveEmail } = useEmailDomain()

  const stepsFields = [
    ['nombre', 'apellido', 'correo', 'fechaNacimiento', 'telefono', 'cedula'],
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
    zodResolver(registration ? coordSignupFormSchema : coordCreateFormSchema)
  )

  const busy = registration ? isPending : isCreating

  function onSubmit(data) {
    if (registration) {
      externalOnSubmit({
        nombre: data.nombre,
        apellido: data.apellido,
        fechaNacimiento: data.fechaNacimiento,
        telefono: data.telefono,
        cedula: data.cedula,
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
          rol: 'coordinador',
          cedula: data.cedula,
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
          icon={<HiChevronLeft strokeWidth={1} />}
          iconPos="left"
          disabled={busy}
        >
          Anterior
        </Button>
      )}
      <Button
        type="button"
        variant="primary"
        onClick={isLast ? handleSubmit(onSubmit) : handleNext}
        className={currStep === 0 ? 'w-full' : 'flex-[70%]'}
        icon={
          isLast ? (
            <HiCheck strokeWidth={1} />
          ) : (
            <HiChevronRight strokeWidth={1} />
          )
        }
        iconPos={isLast ? 'left' : 'right'}
        isLoading={busy}
        disabled={busy}
      >
        {isLast ? 'Registrarme' : 'Siguiente'}
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

  return (
    <FormProvider {...methods}>
      <div
        className={
          registration ? undefined : 'min-h-0 flex-1 overflow-y-auto px-8 py-10'
        }
      >
        <Stepper
          steps={steps}
          current={currStep}
          setCurrStep={handleStepClick}
        />
        <form
          className={registration ? 'mt-20 space-y-6' : 'mt-20'}
          onKeyDown={getFormKeyDown(onSubmit, busy)}
        >
          {currStep === 0 && (
            <CoordPersonalInfoForm
              disabledEmail={registration ? email : undefined}
              isUabcDomain={isUabcDomain}
              setIsUabcDomain={setIsUabcDomain}
            />
          )}
          {currStep === 1 && <PasswordComponent />}
        </form>
      </div>
      {nav}
    </FormProvider>
  )
}
