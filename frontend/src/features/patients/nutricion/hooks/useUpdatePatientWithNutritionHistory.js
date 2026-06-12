import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updatePatient } from '@services/apiPatient'
import { updateNutritionHistory } from '@services/apiNutritionHistory'
import { toastApiError } from '@lib/ApiError'

export function useUpdatePatientWithNutritionHistory() {
  const queryClient = useQueryClient()

  function invalidateNutritionPatientQueries() {
    queryClient.invalidateQueries({ queryKey: ['patients'] })
    queryClient.invalidateQueries({ queryKey: ['patient'] })
    queryClient.invalidateQueries({ queryKey: ['nutrition-histories'] })
    queryClient.invalidateQueries({ queryKey: ['nutrition-history'] })
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ patientId, historyId, patientData, historyData }) => {
      if (!patientData && !(historyId && historyData)) {
        throw new Error('No update payload provided')
      }

      const calls = []
      if (patientData) calls.push(updatePatient(patientId, patientData))
      if (historyId && historyData) calls.push(updateNutritionHistory(historyId, historyData))

      const results = await Promise.allSettled(calls)
      const failed = results.find((result) => result.status === 'rejected')
      if (failed) throw failed.reason
    },
    onSuccess: () => {
      toast.success('Paciente actualizado correctamente')
    },
    onSettled: invalidateNutritionPatientQueries,
  })

  async function update(payload) {
    try {
      return await mutateAsync(payload)
    } catch (err) {
      toastApiError(err)
      throw err
    }
  }

  return { update, isUpdating: isPending }
}
