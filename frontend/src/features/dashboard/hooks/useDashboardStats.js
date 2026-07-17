import { useQuery } from '@tanstack/react-query'
import { getStats } from '@services/apiStats'
import { DEFAULT_STATS_RANGE } from '@cais/shared/constants/stats'

export function useDashboardStats(range = DEFAULT_STATS_RANGE) {
  const { data, isPending } = useQuery({
    queryKey: ['stats', range],
    queryFn: () => getStats(range),
    staleTime: 1000 * 60 * 2,
  })

  return { stats: data, isPending }
}
