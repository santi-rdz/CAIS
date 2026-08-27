import { useInfiniteList } from '@hooks/useInfiniteList'
import { getRec24hs } from '@services/apiRec24h'

export function useRec24hs(historiaId) {
  return useInfiniteList({
    queryKey: ['rec-24h-list', historiaId],
    queryFn: ({ page, limit }) => getRec24hs(historiaId, { page, limit }),
    listKey: 'recs',
    enabled: !!historiaId,
  })
}
