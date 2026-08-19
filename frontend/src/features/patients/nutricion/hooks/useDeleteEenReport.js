import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteEenReport } from '@services/apiEenReport'
import { toastApiError } from '@lib/ApiError'

export function useDeleteEenReport(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteEenReport(id),
    onSuccess: (_, id) => {
      toast.success('Reporte EEN eliminado')
      queryClient.invalidateQueries({ queryKey: ['reporte-een-list', historiaId] })
      queryClient.removeQueries({ queryKey: ['reporte-een', id] })
    },
    onError: toastApiError,
  })

  return { deleteReporte: mutateAsync, isDeleting }
}
