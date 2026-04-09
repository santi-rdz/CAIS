import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMedicalHistory } from '@services/apiMedicalHistory'
import { toastApiError } from '@lib/ApiError'

export function useCreateMedicalHistory() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ pacienteId, historyData }) =>
      createMedicalHistory({ paciente_id: pacienteId, ...historyData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-histories'] })
      queryClient.invalidateQueries({ queryKey: ['medical-history'] })
      toast.success('Historia médica creada correctamente')
    },
  })

  async function createHistory(payload) {
    try {
      return await mutateAsync(payload)
    } catch (err) {
      toastApiError(err)
      throw err
    }
  }

  return { createHistory, isCreating: isPending }
}
