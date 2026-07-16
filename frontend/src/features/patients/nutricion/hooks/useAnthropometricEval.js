import { useQuery } from '@tanstack/react-query'
import { getAnthropometricEvalById } from '@services/apiAntropometrica'

export function useAnthropometricEval(id) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['antro', id],
    queryFn: () => getAnthropometricEvalById(id),
    enabled: Boolean(id),
  })

  return { evalAntro: data ?? null, isPending, isError, error }
}
