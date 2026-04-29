import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { changePassword as apiChangePassword } from '@services/ApiAuth'

export default function useChangePassword() {
  const { mutateAsync, isPending: isChanging } = useMutation({
    mutationFn: apiChangePassword,
  })

  function changePassword(data, { onSuccess } = {}) {
    const promise = mutateAsync(data)
    toast.promise(promise, {
      loading: 'Actualizando contraseña...',
      success: () => {
        onSuccess?.()
        return 'Contraseña actualizada exitosamente'
      },
      error: (err) => err?.message ?? 'Error al actualizar la contraseña',
    })
    return promise
  }

  return { changePassword, isChanging }
}
