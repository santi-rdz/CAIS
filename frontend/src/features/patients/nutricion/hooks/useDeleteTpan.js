import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteTpan } from '@services/apiTpan'
import { toastApiError } from '@lib/ApiError'

export function useDeleteTpan(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteTpan(id),
    onSuccess: (_, id) => {
      toast.success('TPAN eliminado')
      queryClient.invalidateQueries({ queryKey: ['tpan-list', historiaId] })
      queryClient.removeQueries({ queryKey: ['tpan', id] })
    },
    onError: toastApiError,
  })

  return { deleteTpan: mutateAsync, isDeleting }
}
