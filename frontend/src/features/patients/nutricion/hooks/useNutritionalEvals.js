import { useInfiniteList } from '@hooks/useInfiniteList'
import { getNutritionalEvals } from '@services/apiNutritionalEval'

export function useNutritionalEvals(historiaId) {
  return useInfiniteList({
    queryKey: ['nutritional-evals', historiaId],
    queryFn: ({ page, limit }) => getNutritionalEvals(historiaId, { page, limit }),
    listKey: 'evals',
    enabled: !!historiaId,
  })
}
