import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createEenReport } from '@services/apiEenReport'
import { toastApiError } from '@lib/ApiError'

export function useCreateEenReport(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: createReporte, isPending: isCreating } = useMutation({
    mutationFn: (data) => createEenReport(data),
    onSuccess: () => {
      toast.success('Reporte EEN guardado')
      queryClient.invalidateQueries({ queryKey: ['reporte-een-list', historiaId] })
    },
    onError: toastApiError,
  })

  return { createReporte, isCreating }
}
