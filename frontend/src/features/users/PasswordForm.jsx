import Heading from '@components/Heading'
import PasswordInput from '@components/PasswordInput'
import { useFormContext } from 'react-hook-form'
import { HiInformationCircle } from 'react-icons/hi2'

export default function PasswordForm() {
  const { register, formState } = useFormContext()
  const { errors } = formState

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar required>
        Contraseña
      </Heading>
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <div className="flex items-center gap-2 font-medium text-blue-800">
          <HiInformationCircle size={20} />
          <span>Contraseña temporal</span>
        </div>
        <p className="text-5 mt-1 text-blue-700">
          El usuario deberá cambiar su contraseña en el primer inicio de sesión
          por seguridad.
        </p>
      </div>

      <PasswordInput
        id="password"
        label="Contraseña temporal"
        placeholder="Mínimo 6 caracteres"
        error={errors?.password?.message}
        registration={register('password')}
        variant="outline"
      />
    </div>
  )
}
