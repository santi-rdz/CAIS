import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTpan } from '@services/apiTpan'
import { toastApiError } from '@lib/ApiError'

export function useCreateTpan(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: createTpanRecord, isPending: isCreating } = useMutation({
    mutationFn: (data) => createTpan(data),
    onSuccess: () => {
      toast.success('TPAN registrado')
      queryClient.invalidateQueries({ queryKey: ['tpan-list', historiaId] })
    },
    onError: toastApiError,
  })

  return { createTpan: createTpanRecord, isCreating }
}
