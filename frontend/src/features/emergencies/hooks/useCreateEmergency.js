import { toastApiError } from '@lib/ApiError'
import { createEmergency as apiCreateEmergency } from '@services/ApiEmergencies'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateEmergency() {
  const queryClient = useQueryClient()
  const { mutate: createEmergency, isPending: isCreating } = useMutation({
    mutationFn: (data) => apiCreateEmergency(data),
    onSuccess: () => {
      toast.success('Emergencia creada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['emergencies'] })
    },
    onError: toastApiError,
  })

  return { createEmergency, isCreating }
}
