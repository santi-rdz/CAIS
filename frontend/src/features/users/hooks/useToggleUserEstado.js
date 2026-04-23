import { updateUserEstado } from '@services/ApiUsers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastApiError } from '@lib/ApiError'

export default function useToggleUserEstado() {
  const queryClient = useQueryClient()

  const { mutate: toggleEstado, isPending } = useMutation({
    mutationFn: ({ id, estado }) => updateUserEstado(id, estado),
    onSuccess: (_, { estado }) => {
      const msg =
        estado === 'INACTIVO' ? 'Usuario desactivado' : 'Usuario activado'
      toast.success(msg)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: toastApiError,
  })

  return { toggleEstado, isPending }
}
