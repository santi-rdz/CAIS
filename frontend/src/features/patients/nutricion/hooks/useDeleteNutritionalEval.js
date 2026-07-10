import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteNutritionalEval } from '@services/apiNutritionalEval'
import { toastApiError } from '@lib/ApiError'

export function useDeleteNutritionalEval(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteNutritionalEval(id),
    onSuccess: (_, id) => {
      toast.success('Evaluación nutricional eliminada')
      queryClient.invalidateQueries({ queryKey: ['nutritional-evals', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['nutritional-eval', id] })
    },
    onError: toastApiError,
  })

  return { deleteEval: mutateAsync, isDeleting }
}
