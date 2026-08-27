import { useInfiniteList } from '@hooks/useInfiniteList'
import { getAnthropometricEvals } from '@services/apiAntropometrica'

export function useAnthropometricEvals(historiaId) {
  return useInfiniteList({
    queryKey: ['antro-list', historiaId],
    queryFn: ({ page, limit }) => getAnthropometricEvals(historiaId, { page, limit }),
    listKey: 'evals',
    enabled: !!historiaId,
  })
}
