import PasswordInput from '@ui/PasswordInput'
import { useFormContext } from 'react-hook-form'
import { HiCheck, HiXMark } from 'react-icons/hi2'

const requirements = [
  { label: 'Al menos 8 caracteres', test: (v) => v.length >= 8 },
  { label: 'Una letra mayúscula', test: (v) => /[A-Z]/.test(v) },
  { label: 'Una letra minúscula', test: (v) => /[a-z]/.test(v) },
  { label: 'Un número', test: (v) => /[0-9]/.test(v) },
  {
    label: 'Un carácter especial (!@#$%^&*)',
    test: (v) => /[!@#$%^&*]/.test(v),
  },
]

function RequirementItem({ met, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full text-xs ${met ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
      >
        {met ? (
          <HiCheck strokeWidth={2} size={12} />
        ) : (
          <HiXMark strokeWidth={2} size={12} />
        )}
      </span>
      <span className={`text-5 ${met ? 'text-green-700' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  )
}

export default function RegistrationPasswordForm() {
  const { register, formState, watch } = useFormContext()
  const { errors } = formState
  const password = watch('password') ?? ''

  return (
    <div className="space-y-4">
      <PasswordInput
        id="password"
        label="Contraseña"
        placeholder="Contraseña"
        error={errors?.password?.message}
        registration={register('password')}
        variant="outline"
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirmar contraseña"
        placeholder="Confirma tu contraseña"
        error={errors?.confirmPassword?.message}
        registration={register('confirmPassword')}
        variant="outline"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
        <p className="text-5 mb-3 font-semibold text-gray-700">
          Tu contraseña debe contener:
        </p>
        <div className="space-y-2">
          {requirements.map((req) => (
            <RequirementItem
              key={req.label}
              met={req.test(password)}
              label={req.label}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
