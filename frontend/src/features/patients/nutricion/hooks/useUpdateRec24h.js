import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateRec24h } from '@services/apiRec24h'
import { toastApiError } from '@lib/ApiError'

export function useUpdateRec24h(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateRec, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateRec24h(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Recordatorio de 24 horas actualizado')
      queryClient.invalidateQueries({ queryKey: ['rec-24h-list', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['rec-24h', id] })
    },
    onError: toastApiError,
  })

  return { updateRec, isUpdating }
}
