import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createRec24h } from '@services/apiRec24h'
import { toastApiError } from '@lib/ApiError'

export function useCreateRec24h(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: createRec, isPending: isCreating } = useMutation({
    mutationFn: (data) => createRec24h(data),
    onSuccess: () => {
      toast.success('Recordatorio de 24 horas guardado')
      queryClient.invalidateQueries({ queryKey: ['rec-24h-list', historiaId] })
    },
    onError: toastApiError,
  })

  return { createRec, isCreating }
}
