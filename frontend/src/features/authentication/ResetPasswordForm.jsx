import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useParams } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi2'
import { resetPasswordFormSchema } from '@schemas/passwordReset'
import PasswordInput from '@components/PasswordInput'
import Button from '@components/Button'
import Spinner from '@components/Spinner'
import PasswordRequirements from '@features/users/components/PasswordRequirements'
import useResetPassword from '@features/authentication/useResetPassword'
import useResetTokenInfo from '@features/authentication/useResetTokenInfo'

export default function ResetPasswordForm() {
  const { token } = useParams()
  const { correo, isLoading, isError } = useResetTokenInfo(token)
  const { resetPassword, isPending } = useResetPassword()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordFormSchema), mode: 'onChange' })

  const password = watch('password') ?? ''

  if (!token) return <Navigate to="/login" replace />

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )

  if (isError)
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
          <p className="font-medium text-red-700">Enlace inválido o expirado</p>
          <p className="text-5 mt-1 text-red-600">
            El enlace para restablecer tu contraseña no es válido o ya fue utilizado.
          </p>
        </div>
        <Link
          to="/recuperar-contrasena"
          className="text-6 flex items-center justify-center gap-1.5 font-medium text-blue-600 hover:underline"
        >
          <HiArrowLeft size={16} />
          Solicitar un nuevo enlace
        </Link>
      </div>
    )

  function onSubmit({ password, confirmPassword }) {
    resetPassword({ token, password, confirmPassword })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {correo && (
        <p className="text-5 text-neutral-500">
          Cuenta: <span className="font-medium text-neutral-700">{correo}</span>
        </p>
      )}

      <PasswordInput
        id="password"
        label="Nueva contraseña"
        placeholder="Ingresa una contraseña segura"
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

      <Button isLoading={isPending} type="submit" className="mt-2 w-full">
        Actualizar contraseña
      </Button>
    </form>
  )
}
