import { useQuery } from '@tanstack/react-query'
import { getNutritionHistory } from '@services/apiNutritionHistory'

export function useNutritionHistory(id) {
  const {
    data: historia,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['nutrition-history', id],
    queryFn: () => getNutritionHistory(id),
    enabled: !!id,
  })

  return { historia, isPending, isError, error }
}
