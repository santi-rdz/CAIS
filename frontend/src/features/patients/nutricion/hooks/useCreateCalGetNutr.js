import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCalGetNutr } from '@services/apiCalGetNutr'
import { toastApiError } from '@lib/ApiError'

export function useCreateCalGetNutr(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: createRegistro, isPending: isCreating } = useMutation({
    mutationFn: (data) => createCalGetNutr(data),
    onSuccess: () => {
      toast.success('Cálculo de GET nutricional guardado')
      queryClient.invalidateQueries({ queryKey: ['cal-get-nutr-list', historiaId] })
    },
    onError: toastApiError,
  })

  return { createRegistro, isCreating }
}
