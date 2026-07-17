import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { registerMedicalPatient } from '@services/apiMedicalHistory'
import { toastApiError } from '@lib/ApiError'

export function useCreatePatientWithHistory() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    // Registro atómico server-side: el backend crea paciente + historia en una
    // sola transacción, así que no hay rollback ni paciente huérfano que manejar.
    mutationFn: ({ patientData, historyData }) =>
      registerMedicalPatient({ patient: patientData, historia: historyData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['medical-histories'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Paciente registrado correctamente')
    },
  })

  async function register(payload) {
    try {
      return await mutateAsync(payload)
    } catch (err) {
      toastApiError(err)
      throw err
    }
  }

  return { register, isRegistering: isPending }
}
