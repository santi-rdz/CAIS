import Button from '@components/Button'
import ModalBody from '@components/ModalBody'
import ModalActions from '@components/ModalActions'
import Stepper from '@components/Stepper'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider } from 'react-hook-form'
import { HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import {
  internCreateSchema,
  internSelfRegisterBaseSchema,
} from '@cais/shared/schemas/users'
import { dayjsDateSchema } from '@cais/shared/schemas/fields'
import { z } from 'zod'
import dayjs from 'dayjs'

const internSignupFormSchema = internSelfRegisterBaseSchema
  .omit({ token: true })
  .extend({ fechaNacimiento: dayjsDateSchema })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

const internEditSchema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  fechaNacimiento: dayjsDateSchema,
  telefono: z.string().optional(),
  correo: z.string().email('Correo inválido'),
  matricula: z.string().min(1, 'La matrícula es requerida').max(20),
  servicioInicioAnio: z.string().min(1, 'Selecciona el año de inicio'),
  servicioInicioPeriodo: z.string().min(1, 'Selecciona el periodo de inicio'),
  servicioFinAnio: z.string().min(1, 'Selecciona el año de fin'),
  servicioFinPeriodo: z.string().min(1, 'Selecciona el periodo de fin'),
})

function parseUserDefaults(user) {
  const nombre = user.nombre ?? ''
  const apellido = user.apellido ?? ''

  const [inicioAnio = '', inicioPeriodo = ''] = (
    user.inicio_servicio ?? ''
  ).split('-')
  const [finAnio = '', finPeriodo = ''] = (user.fin_servicio ?? '').split('-')

  return {
    nombre,
    apellido,
    fechaNacimiento: user.fecha_nacimiento
      ? dayjs(user.fecha_nacimiento)
      : null,
    telefono: user.telefono ?? '',
    correo: user.correo ?? '',
    matricula: user.matricula ?? '',
    servicioInicioAnio: inicioAnio,
    servicioInicioPeriodo: inicioPeriodo,
    servicioFinAnio: finAnio,
    servicioFinPeriodo: finPeriodo,
  }
}

import useCreateUser from './hooks/useCreateUser'
import useUpdateUser from './hooks/useUpdateUser'
import useEmailDomain from '@hooks/useEmailDomain'
import { useStepForm } from '../../hooks/useStepForm'
import PasswordForm from './PasswordForm'
import RegistrationPasswordForm from './RegistrationPasswordForm'
import InterPersonalInfoForm from './InterPersonalInfoForm'
import InterAcademicInfoForm from './InterAcademicInfoForm'
import Modal from '@components/Modal'

const CREATE_STEPS = ['Inf. Personal', 'Contraseña']
const EDIT_STEPS = ['Inf. Personal']

export default function InternForm({
  onClose,
  onCloseModal,
  registration = false,
  email,
  onSubmit: externalOnSubmit,
  isPending = false,
  user, // present in edit mode
}) {
  const close = onClose ?? onCloseModal
  const isEdit = Boolean(user)
  const steps = isEdit ? EDIT_STEPS : CREATE_STEPS

  const { createUser, isCreating } = useCreateUser()
  const { updateUser, isUpdating } = useUpdateUser()
  const { isUabcDomain, setIsUabcDomain, resolveEmail, correoField } =
    useEmailDomain()

  const createFormSchema = internCreateSchema
    .omit({ rol: true })
    .extend({ fechaNacimiento: dayjsDateSchema, correo: correoField })

  const allPersonalAndAcademicFields = [
    'nombre',
    'apellido',
    'fechaNacimiento',
    'telefono',
    'correo',
    'matricula',
    'servicioInicioAnio',
    'servicioInicioPeriodo',
    'servicioFinAnio',
    'servicioFinPeriodo',
  ]

  const stepsFields = isEdit
    ? [allPersonalAndAcademicFields]
    : [
        allPersonalAndAcademicFields,
        registration ? ['password', 'confirmPassword'] : ['password'],
      ]

  const defaultValues = isEdit
    ? parseUserDefaults(user)
    : registration
      ? { correo: email }
      : {}

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
    getFormKeyDown,
  } = useStepForm(steps, stepsFields, defaultValues, resolver)

  const busy = isEdit ? isUpdating : registration ? isPending : isCreating

  function onSubmit(data) {
    if (isEdit) {
      updateUser(
        {
          id: user.id,
          data: {
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            fechaNacimiento: data.fechaNacimiento,
            telefono: data.telefono,
            matricula: data.matricula,
            servicioInicioAnio: data.servicioInicioAnio,
            servicioInicioPeriodo: data.servicioInicioPeriodo,
            servicioFinAnio: data.servicioFinAnio,
            servicioFinPeriodo: data.servicioFinPeriodo,
          },
        },
        { onSuccess: () => close?.() }
      )
      return
    }

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
        { onSuccess: () => close?.() }
      )
    }
  }

  const PasswordComponent = registration
    ? RegistrationPasswordForm
    : PasswordForm

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
      {steps.length > 1 && (
        <Stepper
          steps={steps}
          current={currStep}
          setCurrStep={handleStepClick}
        />
      )}
      <form className="mt-6" onKeyDown={getFormKeyDown(onSubmit, busy)}>
        {currStep === 0 && (
          <>
            <InterPersonalInfoForm />
            <div className="mt-6">
              <InterAcademicInfoForm
                disabledEmail={
                  isEdit ? user.correo : registration ? email : undefined
                }
                isUabcDomain={isUabcDomain}
                setIsUabcDomain={setIsUabcDomain}
              />
            </div>
          </>
        )}
        {!isEdit && currStep === 1 && <PasswordComponent />}
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
              <Modal.Title>Editar pasante</Modal.Title>
            </Modal.Heading>
          )}
          <ModalBody py={6}>{content}</ModalBody>
        </>
      )}
      {nav}
    </FormProvider>
  )
}
