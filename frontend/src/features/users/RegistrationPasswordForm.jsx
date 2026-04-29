import PasswordInput from '@components/PasswordInput'
import { useFormContext } from 'react-hook-form'
import PasswordRequirements from './components/PasswordRequirements'

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

      <PasswordRequirements password={password} />
    </div>
  )
}
