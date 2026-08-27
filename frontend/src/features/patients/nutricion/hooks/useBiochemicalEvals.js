import { useInfiniteList } from '@hooks/useInfiniteList'
import { getBiochemicalEvals } from '@services/apiBiochemicalEval'

export function useBiochemicalEvals(historiaId) {
  return useInfiniteList({
    queryKey: ['biochemical-evals', historiaId],
    queryFn: ({ page, limit }) => getBiochemicalEvals(historiaId, { page, limit }),
    listKey: 'evaluations',
    enabled: !!historiaId,
  })
}
