import { formatFecha } from '@lib/dateHelpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteEmergency as apiDeleteEmergency } from '@services/ApiEmergencies'

export function useDeleteEmergency() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => apiDeleteEmergency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencies'] })
    },
  })

  function deleteEmergency(id) {
    toast.promise(mutateAsync(id), {
      loading: 'Eliminando emergencia...',
      success: (data) =>
        `Emergencia del ${formatFecha(data.fecha_hora)} eliminada`,
      error: 'No se pudo eliminar la emergencia',
    })
  }

  return { deleteEmergency, isDeleting }
}
