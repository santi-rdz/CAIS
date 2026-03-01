import PasswordInput from '@ui/PasswordInput'
import { useFormContext } from 'react-hook-form'
import { HiInformationCircle } from 'react-icons/hi2'

export default function PasswordForm() {
  const { register, formState, getValues } = useFormContext()
  const { errors } = formState

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <div className="flex items-center gap-2 font-medium text-blue-800">
          <HiInformationCircle size={20} />
          <span>Contraseña temporal</span>
        </div>
        <p className="text-5 mt-1 text-blue-700">
          El usuario deberá cambiar su contraseña en el primer inicio de sesión por seguridad.
        </p>
      </div>

      <PasswordInput
        id="password"
        label="Contraseña temporal"
        placeholder="Contraseña"
        error={errors?.password?.message}
        registration={register('password', { required: 'Ingresa una contraseña' })}
        variant="outline"
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirmar contraseña temporal"
        placeholder="Confirma tu contraseña"
        error={errors?.confirmPassword?.message}
        registration={register('confirmPassword', {
          required: 'Confirma la contraseña',
          validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden',
        })}
        variant="outline"
      />
    </div>
  )
}
