import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiCheck } from 'react-icons/hi2'
import { changePasswordSchema } from '@cais/shared/schemas/users'
import PasswordInput from '@components/PasswordInput'
import Button from '@components/Button'
import Heading from '@components/Heading'
import PasswordRequirements from './components/PasswordRequirements'
import useChangePassword from './hooks/useChangePassword'

export default function ChangePasswordForm() {
  const { changePassword, isChanging } = useChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordSchema), mode: 'onChange' })

  const newPassword = watch('newPassword') ?? ''

  function onSubmit(data) {
    changePassword(data, { onSuccess: reset })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Heading as="h3" showBar>
        Cambiar contraseña
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <PasswordInput
          id="currentPassword"
          label="Contraseña actual"
          placeholder="Ingresa tu contraseña actual"
          error={errors.currentPassword?.message}
          registration={register('currentPassword')}
          variant="outline"
        />
        <PasswordInput
          id="newPassword"
          label="Nueva contraseña"
          placeholder="Mínimo 8 caracteres, mayúscula y número"
          error={errors.newPassword?.message}
          registration={register('newPassword')}
          variant="outline"
        />
        <PasswordInput
          id="confirmNewPassword"
          label="Confirmar nueva contraseña"
          placeholder="Repite la nueva contraseña"
          error={errors.confirmNewPassword?.message}
          registration={register('confirmNewPassword')}
          variant="outline"
        />
        <PasswordRequirements password={newPassword} />
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="gap-1.5"
            isLoading={isChanging}
            disabled={isChanging}
          >
            <HiCheck strokeWidth={1} />
            Guardar contraseña
          </Button>
        </div>
      </form>
    </div>
  )
}
