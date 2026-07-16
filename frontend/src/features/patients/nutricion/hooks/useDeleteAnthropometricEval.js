import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteAnthropometricEval } from '@services/apiAntropometrica'
import { toastApiError } from '@lib/ApiError'

export function useDeleteAnthropometricEval(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteAnthropometricEval(id),
    onSuccess: (_, id) => {
      toast.success('Evaluación antropométrica eliminada')
      queryClient.invalidateQueries({ queryKey: ['antro-list', historiaId] })
      queryClient.removeQueries({ queryKey: ['antro', id] })
    },
    onError: toastApiError,
  })

  return { deleteEval: mutateAsync, isDeleting }
}
