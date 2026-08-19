import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateEenReport } from '@services/apiEenReport'
import { toastApiError } from '@lib/ApiError'

export function useUpdateEenReport(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateReporte, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateEenReport(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Reporte EEN actualizado')
      queryClient.invalidateQueries({ queryKey: ['reporte-een-list', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['reporte-een', id] })
    },
    onError: toastApiError,
  })

  return { updateReporte, isUpdating }
}
