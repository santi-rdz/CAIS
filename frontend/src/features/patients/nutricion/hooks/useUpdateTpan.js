import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateTpan } from '@services/apiTpan'
import { toastApiError } from '@lib/ApiError'

export function useUpdateTpan(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateTpanRecord, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateTpan(id, data),
    onSuccess: (_, { id }) => {
      toast.success('TPAN actualizado')
      queryClient.invalidateQueries({ queryKey: ['tpan-list', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['tpan', id] })
    },
    onError: toastApiError,
  })

  return { updateTpan: updateTpanRecord, isUpdating }
}
