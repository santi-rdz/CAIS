import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updatePatient } from '@services/apiPatient'
import { updateMedicalHistory } from '@services/apiMedicalHistory'
import { toastApiError } from '@lib/ApiError'

export function useUpdatePatientWithHistory() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ patientId, historyId, patientData, historyData }) => {
      const calls = []
      if (patientData) calls.push(updatePatient(patientId, patientData))
      if (historyData) calls.push(updateMedicalHistory(historyId, historyData))

      await Promise.all(calls)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patient'] })
      queryClient.invalidateQueries({ queryKey: ['medical-histories'] })
      queryClient.invalidateQueries({ queryKey: ['medical-history'] })
      toast.success('Paciente actualizado correctamente')
    },
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
