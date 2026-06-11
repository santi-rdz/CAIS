import { useQuery } from '@tanstack/react-query'
import { getNutritionHistories } from '@services/apiNutritionHistory'

export function useNutritionHistories(pacienteId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['nutrition-histories', pacienteId],
    queryFn: () => getNutritionHistories(pacienteId),
    enabled: !!pacienteId,
  })

  return { histories: data?.histories ?? [], isPending, isError, error }
}
