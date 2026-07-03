import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteBiochemicalEval } from '@services/apiBiochemicalEval'
import { toastApiError } from '@lib/ApiError'

export function useDeleteBiochemicalEval(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteBiochemicalEval(id),
    onSuccess: (_, id) => {
      toast.success('Evaluación bioquímica eliminada')
      queryClient.invalidateQueries({ queryKey: ['biochemical-evals', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['biochemical-eval', id] })
    },
    onError: toastApiError,
  })

  return { deleteEval: mutateAsync, isDeleting }
}
