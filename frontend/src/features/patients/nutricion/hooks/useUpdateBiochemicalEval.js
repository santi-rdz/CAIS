import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateBiochemicalEval } from '@services/apiBiochemicalEval'
import { toastApiError } from '@lib/ApiError'

export function useUpdateBiochemicalEval(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateEval, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateBiochemicalEval(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Evaluación bioquímica actualizada')
      queryClient.invalidateQueries({ queryKey: ['biochemical-evals', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['biochemical-eval', id] })
    },
    onError: toastApiError,
  })

  return { updateEval, isUpdating }
}
