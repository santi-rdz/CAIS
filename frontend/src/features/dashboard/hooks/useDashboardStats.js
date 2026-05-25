import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '@services/apiDashboard'

export function useDashboardStats() {
  const { data, isPending } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 2,
  })

  return { stats: data, isPending }
}
