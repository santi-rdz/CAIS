import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createNutritionalEval } from '@services/apiNutritionalEval'
import { toastApiError } from '@lib/ApiError'

export function useCreateNutritionalEval(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: createEval, isPending: isCreating } = useMutation({
    mutationFn: (data) => createNutritionalEval(data),
    onSuccess: () => {
      toast.success('Evaluación nutricional guardada')
      queryClient.invalidateQueries({ queryKey: ['nutritional-evals', historiaId] })
    },
    onError: toastApiError,
  })

  return { createEval, isCreating }
}
