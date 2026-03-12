import Button from '@ui/Button'
import ModalActions from '@ui/ModalActions'
import Stepper from '@ui/Stepper'
import { FormProvider } from 'react-hook-form'
import { HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import useCreateUser from './useCreateUser'
import useEmailDomain from '@hooks/useEmailDomain'
import { useStepForm } from './useStepForm'
import PasswordForm from './PasswordForm'
import RegistrationPasswordForm from './RegistrationPasswordForm'
import InterPersonalInfoForm from './InterPersonalInfoForm'
import InterAcademicInfoForm from './InterAcademicInfoForm'

const steps = ['Información Personal', 'Información Académica', 'Contraseña']

export default function InternForm({
  onClose,
  registration = false,
  email,
  onSubmit: externalOnSubmit,
  isPending = false,
}) {
  const { createUser, isCreating } = useCreateUser()
  const { isUabcDomain, setIsUabcDomain, resolveEmail } = useEmailDomain()

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
  } = useStepForm(steps, stepsFields, registration ? { username: email } : {})

  const busy = registration ? isPending : isCreating

  function onSubmit(data) {
    if (registration) {
      externalOnSubmit({
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
    } else {
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
          className={'mt-16'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
              e.preventDefault()
              if (isLast) handleSubmit(onSubmit)()
              else handleNext()
            }
          }}
        >
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
      </div>
      {nav}
    </FormProvider>
  )
}
