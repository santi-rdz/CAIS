import { toastApiError } from '@lib/ApiError'
import { updateEmergency as apiUpdateEmergency } from '@services/ApiEmergencies'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useParams } from 'react-router'

export function useUpdateEmergency() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { mutate: updateEmergency, isPending: isUpdating } = useMutation({
    mutationFn: (data) => apiUpdateEmergency(id, data),
    onSuccess: () => {
      toast.success('Emergencia actualizada')
      queryClient.invalidateQueries({ queryKey: ['emergency', id] })
      queryClient.invalidateQueries({ queryKey: ['emergencies'] })
    },
    onError: toastApiError,
  })

  return { updateEmergency, isUpdating }
}
