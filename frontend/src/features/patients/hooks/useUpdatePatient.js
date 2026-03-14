import { toastApiError } from '@lib/ApiError'
import { updatePatient as apiUpdatePatient } from '@services/apiPatient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { toast } from 'sonner'

export function useUpdatePatient() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => apiUpdatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', id] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })

  function updatePatient(data) {
    const promise = mutateAsync({ id, data })
    toast.promise(promise, {
      loading: 'Actualizando paciente...',
      success: 'Paciente actualizado',
      error: toastApiError,
    })
    return promise
  }

  return { updatePatient, isUpdating }
}
