import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createNutritionHistory } from '@services/apiNutritionHistory'
import { toastApiError } from '@lib/ApiError'

export function useCreateNutritionHistory() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ pacienteId, historyData }) =>
      createNutritionHistory({ paciente_id: pacienteId, ...historyData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-histories'] })
      queryClient.invalidateQueries({ queryKey: ['nutrition-history'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Historia nutricional creada correctamente')
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
