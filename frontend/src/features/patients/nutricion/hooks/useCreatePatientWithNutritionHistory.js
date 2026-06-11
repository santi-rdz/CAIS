import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { registerNutritionPatient } from '@services/apiNutritionHistory'
import { toastApiError } from '@lib/ApiError'

export function useCreatePatientWithNutritionHistory() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    // Registro atómico server-side: el backend crea paciente + historia en una
    // sola transacción, así que no hay rollback ni paciente huérfano que manejar.
    mutationFn: ({ patientData, historyData }) =>
      registerNutritionPatient({ patient: patientData, historia: historyData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['nutrition-histories'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
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
