import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateCalGetNutr } from '@services/apiCalGetNutr'
import { toastApiError } from '@lib/ApiError'

export function useUpdateCalGetNutr(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateRegistro, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateCalGetNutr(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Cálculo de GET nutricional actualizado')
      queryClient.invalidateQueries({ queryKey: ['cal-get-nutr-list', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['cal-get-nutr', id] })
    },
    onError: toastApiError,
  })

  return { updateRegistro, isUpdating }
}
