import { useInfiniteList } from '@hooks/useInfiniteList'
import { getCalGetNutrs } from '@services/apiCalGetNutr'

export function useCalGetNutrs(historiaId) {
  return useInfiniteList({
    queryKey: ['cal-get-nutr-list', historiaId],
    queryFn: ({ page, limit }) => getCalGetNutrs(historiaId, { page, limit }),
    listKey: 'registros',
    enabled: !!historiaId,
  })
}
