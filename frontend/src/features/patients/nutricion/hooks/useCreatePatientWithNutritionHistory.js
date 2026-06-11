import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPatient, deletePatient } from '@services/apiPatient'
import { createNutritionHistory } from '@services/apiNutritionHistory'
import { toastApiError } from '@lib/ApiError'

export function useCreatePatientWithNutritionHistory() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ patientData, historyData }) => {
      const { patient } = await createPatient(patientData)

      try {
        await createNutritionHistory({ paciente_id: patient.id, ...historyData })
      } catch (historyError) {
        try {
          await deletePatient(patient.id)
        } catch (rollbackError) {
          console.error('Rollback failed, orphan patient:', patient.id, rollbackError)
        }
        throw historyError
      }

      return patient
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['nutrition-histories'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Paciente registrado correctamente')
    },
  })

  async function register(payload) {
    try {
      const result = await mutateAsync(payload)
      return result
    } catch (err) {
      toastApiError(err)
      throw err
    }
  }

  return { register, isRegistering: isPending }
}
