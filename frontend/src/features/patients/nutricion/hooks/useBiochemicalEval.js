import { useQuery } from '@tanstack/react-query'
import { getBiochemicalEvalById } from '@services/apiBiochemicalEval'

export function useBiochemicalEval(id) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['biochemical-eval', id],
    queryFn: () => getBiochemicalEvalById(id),
    enabled: Boolean(id),
  })

  return { evaluation: data ?? null, isPending, isError, error }
}
