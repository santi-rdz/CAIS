import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePatient as apiDeletePatient } from '@services/apiPatient'
import { toast } from 'sonner'

export function useDeletePatient() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => apiDeletePatient(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  })

  function deletePatient(id) {
    const promise = mutateAsync(id)
    toast.promise(promise, {
      loading: 'Eliminando paciente...',
      success: 'Paciente eliminado',
      error: 'No se pudo eliminar el paciente',
    })
    return promise
  }

  return { deletePatient, isDeleting }
}
