import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createBiochemicalEval } from '@services/apiBiochemicalEval'
import { toastApiError } from '@lib/ApiError'

export function useCreateBiochemicalEval(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: createEval, isPending: isCreating } = useMutation({
    mutationFn: (data) => createBiochemicalEval(data),
    onSuccess: () => {
      toast.success('Evaluación bioquímica guardada')
      queryClient.invalidateQueries({ queryKey: ['biochemical-evals', historiaId] })
    },
    onError: toastApiError,
  })

  return { createEval, isCreating }
}
