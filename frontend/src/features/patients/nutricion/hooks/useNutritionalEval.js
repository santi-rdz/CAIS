import { useQuery } from '@tanstack/react-query'
import { getNutritionalEvalById } from '@services/apiNutritionalEval'

export function useNutritionalEval(id) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['nutritional-eval', id],
    queryFn: () => getNutritionalEvalById(id),
    enabled: Boolean(id),
  })

  return { evaluation: data ?? null, isPending, isError, error }
}
