import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createAnthropometricEval } from '@services/apiAntropometrica'
import { toastApiError } from '@lib/ApiError'

export function useCreateAnthropometricEval(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: createEval, isPending: isCreating } = useMutation({
    mutationFn: (data) => createAnthropometricEval(data),
    onSuccess: () => {
      toast.success('Evaluación antropométrica registrada')
      queryClient.invalidateQueries({ queryKey: ['antro-list', historiaId] })
    },
    onError: toastApiError,
  })

  return { createEval, isCreating }
}
