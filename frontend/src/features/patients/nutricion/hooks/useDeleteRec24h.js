import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteRec24h } from '@services/apiRec24h'
import { toastApiError } from '@lib/ApiError'

export function useDeleteRec24h(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteRec24h(id),
    onSuccess: (_, id) => {
      toast.success('Recordatorio de 24 horas eliminado')
      queryClient.invalidateQueries({ queryKey: ['rec-24h-list', historiaId] })
      queryClient.removeQueries({ queryKey: ['rec-24h', id] })
    },
    onError: toastApiError,
  })

  return { deleteRec: mutateAsync, isDeleting }
}
