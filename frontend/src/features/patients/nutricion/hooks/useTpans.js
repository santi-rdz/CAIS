import { useInfiniteList } from '@hooks/useInfiniteList'
import { getTpans } from '@services/apiTpan'

export function useTpans(historiaId) {
  return useInfiniteList({
    queryKey: ['tpan-list', historiaId],
    queryFn: ({ page, limit }) => getTpans(historiaId, { page, limit }),
    listKey: 'tpans',
    enabled: !!historiaId,
  })
}
