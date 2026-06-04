import Button from '@components/Button'
import ModalBody from '@components/ModalBody'
import ModalActions from '@components/ModalActions'
import Stepper from '@components/Stepper'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider } from 'react-hook-form'
import { HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { buildInternCreateSchema, internEditSchema, internSignupFormSchema } from '@schemas/users'
import dayjs from 'dayjs'

function parseUserDefaults(user) {
  const nombre = user.nombre ?? ''
  const apellidos = user.apellidos ?? ''

  const [inicioAnio = '', inicioPeriodo = ''] = (user.inicio_servicio ?? '').split('-')
  const [finAnio = '', finPeriodo = ''] = (user.fin_servicio ?? '').split('-')

  return {
    nombre,
    apellidos,
    fecha_nacimiento: user.fecha_nacimiento ? dayjs(user.fecha_nacimiento) : null,
    telefono: user.telefono ?? '',
    correo: user.correo ?? '',
    matricula: user.matricula ?? '',
    servicio_inicio_anio: inicioAnio,
    servicio_inicio_periodo: inicioPeriodo,
    servicio_fin_anio: finAnio,
    servicio_fin_periodo: finPeriodo,
  }
}

import useCreateUser from '@features/users/hooks/useCreateUser'
import useUpdateUser from '@features/users/hooks/useUpdateUser'
import useEmailDomain from '@hooks/useEmailDomain'
import { useStepForm } from '@hooks/useStepForm'
import PasswordForm from '@features/users/PasswordForm'
import RegistrationPasswordForm from '@features/users/RegistrationPasswordForm'
import InterPersonalInfoForm from '@features/users/InterPersonalInfoForm'
import InterAcademicInfoForm from '@features/users/InterAcademicInfoForm'
import Modal from '@components/Modal'

const CREATE_STEPS = ['Inf. Personal', 'Contraseña']
const EDIT_STEPS = ['Inf. Personal']

const PERSONAL_AND_ACADEMIC_FIELDS = [
  'nombre',
  'apellidos',
  'fecha_nacimiento',
  'telefono',
  'correo',
  'matricula',
  'servicio_inicio_anio',
  'servicio_inicio_periodo',
  'servicio_fin_anio',
  'servicio_fin_periodo',
]

export default function InternForm({
  onClose,
  onCloseModal,
  registration = false,
  email,
  onSubmit: externalOnSubmit,
  isPending = false,
  user, // present in edit mode
  title,
  hint,
}) {
  const close = onClose ?? onCloseModal
  const isEdit = Boolean(user)
  const steps = isEdit ? EDIT_STEPS : CREATE_STEPS

  const { createUser, isCreating } = useCreateUser()
  const { updateUser, isUpdating } = useUpdateUser()
  const { isUabcDomain, setIsUabcDomain, resolveEmail, correoField } = useEmailDomain()

  const createFormSchema = buildInternCreateSchema(correoField)

  const stepsFields = isEdit
    ? [PERSONAL_AND_ACADEMIC_FIELDS]
    : [PERSONAL_AND_ACADEMIC_FIELDS, registration ? ['password', 'confirmPassword'] : ['password']]

  const defaultValues = isEdit ? parseUserDefaults(user) : registration ? { correo: email } : {}

  const resolver = isEdit
    ? zodResolver(internEditSchema)
    : zodResolver(registration ? internSignupFormSchema : createFormSchema)

  const {
    currStep,
    setCurrStep,
    handleNext,
    handleStepClick,
    isLast,
    methods,
    handleSubmit,
    getFormSubmit,
  } = useStepForm(steps, stepsFields, defaultValues, resolver)

  const busy = isEdit ? isUpdating : registration ? isPending : isCreating

  function onSubmit(data) {
    if (isEdit) {
      updateUser(
        {
          id: user.id,
          data: {
            nombre: data.nombre,
            apellidos: data.apellidos,
            correo: data.correo,
            fecha_nacimiento: data.fecha_nacimiento,
            telefono: data.telefono,
            matricula: data.matricula,
            servicio_inicio_anio: data.servicio_inicio_anio,
            servicio_inicio_periodo: data.servicio_inicio_periodo,
            servicio_fin_anio: data.servicio_fin_anio,
            servicio_fin_periodo: data.servicio_fin_periodo,
          },
        },
        { onSuccess: () => close?.() }
      )
      return
    }

    if (registration) {
      externalOnSubmit({
        nombre: data.nombre,
        apellidos: data.apellidos,
        fecha_nacimiento: data.fecha_nacimiento,
        telefono: data.telefono,
        matricula: data.matricula,
        servicio_inicio_anio: data.servicio_inicio_anio,
        servicio_inicio_periodo: data.servicio_inicio_periodo,
        servicio_fin_anio: data.servicio_fin_anio,
        servicio_fin_periodo: data.servicio_fin_periodo,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
    } else {
      createUser(
        {
          nombre: data.nombre,
          apellidos: data.apellidos,
          correo: resolveEmail(data.correo),
          fecha_nacimiento: data.fecha_nacimiento,
          telefono: data.telefono,
          rol: 'pasante',
          matricula: data.matricula,
          servicio_inicio_anio: data.servicio_inicio_anio,
          servicio_inicio_periodo: data.servicio_inicio_periodo,
          servicio_fin_anio: data.servicio_fin_anio,
          servicio_fin_periodo: data.servicio_fin_periodo,
          password: data.password,
        },
        { onSuccess: () => close?.() }
      )
    }
  }

  const PasswordComponent = registration ? RegistrationPasswordForm : PasswordForm

  const primaryLabel = isEdit
    ? isLast
      ? 'Guardar cambios'
      : 'Siguiente'
    : isLast
      ? 'Crear usuario'
      : 'Siguiente'

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
      onClose={close}
      primaryAction={{
        label: primaryLabel,
        icon: isLast ? <HiCheck strokeWidth={1} /> : <HiChevronRight strokeWidth={1} />,
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
      {steps.length > 1 && (
        <Stepper steps={steps} current={currStep} setCurrStep={handleStepClick} />
      )}
      <form className="mt-6" onSubmit={getFormSubmit(onSubmit, busy)}>
        {currStep === 0 && (
          <>
            <InterPersonalInfoForm />
            <div className="mt-6">
              <InterAcademicInfoForm
                disabledEmail={isEdit ? user.correo : registration ? email : undefined}
                isUabcDomain={isUabcDomain}
                setIsUabcDomain={setIsUabcDomain}
              />
            </div>
          </>
        )}
        {!isEdit && currStep === 1 && <PasswordComponent />}
        <button type="submit" hidden tabIndex={-1} aria-hidden="true" />
      </form>
    </>
  )

  return (
    <FormProvider {...methods}>
      {registration ? (
        <div>{content}</div>
      ) : (
        <>
          {isEdit && (
            <Modal.Heading>
              <Modal.Title>{title ?? 'Editar pasante'}</Modal.Title>
              {typeof hint === 'function' ? hint(close) : hint}
            </Modal.Heading>
          )}
          <ModalBody py={6}>{content}</ModalBody>
        </>
      )}
      {nav}
    </FormProvider>
  )
}
