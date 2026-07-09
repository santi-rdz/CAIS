import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateNutritionalEval } from '@services/apiNutritionalEval'
import { toastApiError } from '@lib/ApiError'

export function useUpdateNutritionalEval(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateEval, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateNutritionalEval(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Evaluación nutricional actualizada')
      queryClient.invalidateQueries({ queryKey: ['nutritional-evals', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['nutritional-eval', id] })
    },
    onError: toastApiError,
  })

  return { updateEval, isUpdating }
}
