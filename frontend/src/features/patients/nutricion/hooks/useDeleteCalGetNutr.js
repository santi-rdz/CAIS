import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteCalGetNutr } from '@services/apiCalGetNutr'
import { toastApiError } from '@lib/ApiError'

export function useDeleteCalGetNutr(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteCalGetNutr(id),
    onSuccess: (_, id) => {
      toast.success('Cálculo de GET nutricional eliminado')
      queryClient.invalidateQueries({ queryKey: ['cal-get-nutr-list', historiaId] })
      queryClient.removeQueries({ queryKey: ['cal-get-nutr', id] })
    },
    onError: toastApiError,
  })

  return { deleteRegistro: mutateAsync, isDeleting }
}
