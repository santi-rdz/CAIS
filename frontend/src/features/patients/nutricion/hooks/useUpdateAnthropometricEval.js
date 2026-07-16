import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateAnthropometricEval } from '@services/apiAntropometrica'
import { toastApiError } from '@lib/ApiError'

export function useUpdateAnthropometricEval(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateEval, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateAnthropometricEval(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Evaluación antropométrica actualizada')
      queryClient.invalidateQueries({ queryKey: ['antro-list', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['antro', id] })
    },
    onError: toastApiError,
  })

  return { updateEval, isUpdating }
}
