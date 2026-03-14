import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPatient as apiCreatePatient } from '@services/apiPatient'
import { toast } from 'sonner'

export function useCreatePatient() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending: isCreating } = useMutation({
    mutationFn: (data) => apiCreatePatient(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  })

  function createPatient(data) {
    const promise = mutateAsync(data)
    return toast.promise(promise, {
      loading: 'Creando paciente...',
      success: 'Paciente creado exitosamente',
      error: 'No se pudo crear el paciente',
    })
  }

  return { createPatient, isCreating }
}
