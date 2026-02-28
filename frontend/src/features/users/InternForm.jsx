import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useState } from 'react'
import { HiCheck, HiChevronLeft, HiChevronRight, HiEye, HiEyeSlash } from 'react-icons/hi2'
import DatePickerButton from '@ui/DatePickerButton'
import FormRow from '@ui/FormRow'
import Input from '@ui/Input'
import ModalActions from '@ui/ModalActions'
import useCreateUser from './useCreateUser'

const STEPS = ['Información Personal', 'Información Académica', 'Acceso']

const AREAS = [
  { value: 'MEDICINA', label: 'Medicina' },
  { value: 'NUTRICION', label: 'Nutrición' },
  { value: 'PSICOLOGIA', label: 'Psicología' },
  { value: 'PSIQUIATRIA', label: 'Psiquiatría' },
]

// Fields validated per step — trigger() only runs validation for the current step
const STEP_FIELDS = [
  ['firstName', 'lastName', 'email', 'phone', 'birthday'],
  ['area', 'matricula', 'inicio_servicio', 'fin_servicio'],
  ['password', 'confirmPassword'],
]

export default function InternForm({ onClose }) {
  const [currStep, setCurrStep] = useState(0)
  const methods = useForm()
  const { trigger, handleSubmit } = methods
  const { createUser, isCreating } = useCreateUser()
  const isLast = currStep === STEPS.length - 1

  async function handleNext() {
    const valid = await trigger(STEP_FIELDS[currStep])
    if (valid) setCurrStep((s) => s + 1)
  }

  function onSubmit(data) {
    const payload = {
      nombre: `${data.firstName} ${data.lastName}`,
      correo: data.email,
      telefono: data.phone,
      fechaNacimiento: data.birthday?.format?.('YYYY-MM-DD') ?? data.birthday,
      area: data.area,
      matricula: data.matricula,
      inicio_servicio: data.inicio_servicio,
      fin_servicio: data.fin_servicio,
      password: data.password,
      rol: 'PASANTE',
    }
    createUser(payload, { onSuccess: () => onClose?.() })
  }

  return (
    <section>
      <FormProvider {...methods}>
        <div className="p-8 pb-12">
          <Stepper current={currStep} setCurrStep={setCurrStep} />
          <form className="mt-16">
            {currStep === 0 && <PersonalInfoForm />}
            {currStep === 1 && <AcademicInfoForm />}
            {currStep === 2 && <AccessForm />}
          </form>
        </div>
        <ModalActions
          onClose={onClose}
          primaryAction={{
            label: isLast ? 'Crear usuario' : 'Siguiente',
            icon: isLast ? <HiCheck strokeWidth={1} /> : <HiChevronRight strokeWidth={1} />,
            iconPos: isLast ? 'left' : 'right',
            onClick: isLast ? handleSubmit(onSubmit) : handleNext,
            isLoading: isCreating,
          }}
          secondaryAction={{
            label: 'Anterior',
            icon: <HiChevronLeft strokeWidth={1} />,
            iconPos: 'left',
            onClick: () => setCurrStep((s) => s - 1),
            disabled: currStep === 0,
          }}
        />
      </FormProvider>
    </section>
  )
}

// ─── Stepper ─────────────────────────────────────────────────────────────────
// Completed steps (current > i) are clickable to navigate back.
// Active and future steps are non-interactive.

function Stepper({ current, setCurrStep }) {
  return (
    <div className="mx-4 flex">
      {STEPS.map((step, i) => {
        const isLast = i === STEPS.length - 1
        const isCompleted = current > i
        const isActive = current === i
        return (
          <div key={i} className={`flex flex-1 items-center ${isLast ? 'grow-0' : ''}`}>
            <div className="relative">
              <button
                type="button"
                onClick={() => isCompleted && setCurrStep(i)}
                disabled={!isCompleted}
                className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all
                  ${isActive ? 'scale-110 ring-2 ring-green-800 ring-offset-2' : ''}
                  ${isActive || isCompleted ? 'bg-green-800 text-white' : 'bg-gray-200 text-neutral-500'}
                  ${isCompleted ? 'cursor-pointer hover:bg-green-700' : 'cursor-default'}`}
              >
                {isCompleted ? <HiCheck strokeWidth={1.5} size={16} /> : i + 1}
              </button>
              <p
                className={`text-5 absolute left-1/2 mt-2 max-w-[10ch] -translate-x-1/2 text-center text-wrap
                  ${isActive ? 'font-medium text-green-800' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}
              >
                {step}
              </p>
            </div>
            {!isLast && (
              <div
                className={`h-0.5 w-full transition-colors duration-500 ${isCompleted ? 'bg-green-800' : 'bg-gray-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Personal Info ────────────────────────────────────────────────────

function PersonalInfoForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <FormRow htmlFor="firstName" label="Nombre(s)">
          <Input
            {...register('firstName', { required: 'Ingresa el nombre' })}
            id="firstName"
            type="text"
            placeholder="Ej. Juan Carlos"
            hasError={errors?.firstName?.message}
            variant="outline"
          />
        </FormRow>
        <FormRow htmlFor="lastName" label="Apellidos">
          <Input
            {...register('lastName', { required: 'Ingresa los apellidos' })}
            id="lastName"
            type="text"
            placeholder="Ej. Pérez López"
            hasError={errors?.lastName?.message}
            variant="outline"
          />
        </FormRow>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormRow htmlFor="email" label="Correo electrónico">
          <Input
            {...register('email', {
              required: 'Ingresa el correo',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
            })}
            id="email"
            type="email"
            placeholder="usuario@uabc.edu.mx"
            hasError={errors?.email?.message}
            variant="outline"
          />
        </FormRow>
        <FormRow htmlFor="phone" label="Teléfono">
          <Input
            {...register('phone', {
              required: 'Ingresa el teléfono',
              pattern: { value: /^\d{8,15}$/, message: '8–15 dígitos sin espacios' },
            })}
            id="phone"
            type="tel"
            placeholder="Ej. 6861234567"
            hasError={errors?.phone?.message}
            variant="outline"
          />
        </FormRow>
      </div>

      {/* Birthday: Controller wires MUI DatePicker with react-hook-form */}
      <div>
        <label className="text-5 mb-2 block">Fecha de nacimiento</label>
        <Controller
          name="birthday"
          control={control}
          rules={{ required: 'Ingresa la fecha de nacimiento' }}
          render={({ field: { value, onChange } }) => (
            <DatePickerButton label="Seleccionar fecha" date={value ?? null} setDate={onChange} />
          )}
        />
        {errors?.birthday && (
          <span className="text-5 mt-1.5 inline-block text-red-600">{errors.birthday.message}</span>
        )}
      </div>
    </div>
  )
}

// ─── Step 2: Academic Info ────────────────────────────────────────────────────

function AcademicInfoForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="area" className="text-5 mb-2 block">
          Área
        </label>
        <select
          {...register('area', { required: 'Selecciona el área' })}
          id="area"
          className={`text-4 w-full rounded-xl border bg-white px-4 py-3.5 shadow-xs transition-colors
            ${
              errors?.area
                ? 'border-transparent outline-[1.5px] outline-offset-2 outline-red-400'
                : 'border-gray-200 focus-visible:outline-[1.5px] focus-visible:outline-green-900'
            }`}
        >
          <option value="">Seleccionar área</option>
          {AREAS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
        {errors?.area && (
          <span className="text-5 mt-1.5 inline-block text-red-600">{errors.area.message}</span>
        )}
      </div>

      <FormRow htmlFor="matricula" label="Matrícula">
        <Input
          {...register('matricula', { required: 'Ingresa la matrícula' })}
          id="matricula"
          type="text"
          placeholder="Ej. L21012345"
          hasError={errors?.matricula?.message}
          variant="outline"
        />
      </FormRow>

      <div className="grid grid-cols-2 gap-4">
        <FormRow htmlFor="inicio_servicio" label="Inicio de servicio">
          <Input
            {...register('inicio_servicio', { required: 'Ingresa la hora de inicio' })}
            id="inicio_servicio"
            type="time"
            hasError={errors?.inicio_servicio?.message}
            variant="outline"
          />
        </FormRow>
        <FormRow htmlFor="fin_servicio" label="Fin de servicio">
          <Input
            {...register('fin_servicio', { required: 'Ingresa la hora de fin' })}
            id="fin_servicio"
            type="time"
            hasError={errors?.fin_servicio?.message}
            variant="outline"
          />
        </FormRow>
      </div>
    </div>
  )
}

// ─── Step 3: Access ───────────────────────────────────────────────────────────

function AccessForm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')
  const passwordsMatch = password.length >= 8 && password === confirmPassword

  return (
    <div className="space-y-5">
      <FormRow htmlFor="password" label="Contraseña">
        <Input
          {...register('password', {
            required: 'Ingresa una contraseña',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
          })}
          id="password"
          type={showPass ? 'text' : 'password'}
          placeholder="Mínimo 8 caracteres"
          hasError={errors?.password?.message}
          variant="outline"
          style={{ paddingRight: '44px' }}
          suffix={<EyeToggle show={showPass} onToggle={() => setShowPass((v) => !v)} />}
        />
      </FormRow>

      <FormRow htmlFor="confirmPassword" label="Confirmar contraseña">
        <Input
          {...register('confirmPassword', {
            required: 'Confirma la contraseña',
            validate: (v) => v === password || 'Las contraseñas no coinciden',
          })}
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repite la contraseña"
          hasError={errors?.confirmPassword?.message}
          variant="outline"
          style={{ paddingRight: '44px' }}
          suffix={<EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />}
        />
      </FormRow>

      {passwordsMatch && (
        <p className="text-5 flex items-center gap-1.5 text-green-700">
          <HiCheck size={16} strokeWidth={2} />
          Las contraseñas coinciden
        </p>
      )}
    </div>
  )
}

// Wrapper div receives absolute positioning from Input's cloneElement(suffix, ...)
// Inner button retains its own className — prevents the className override
function EyeToggle({ show, onToggle }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="text-gray-400 transition-colors hover:text-gray-600"
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {show ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
      </button>
    </div>
  )
}
