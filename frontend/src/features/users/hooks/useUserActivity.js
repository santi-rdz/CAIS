import { useInfiniteList } from '@hooks/useInfiniteList'
import { getAuditByUser } from '@services/apiAudit'

export function useUserActivity(userId, filters = {}) {
  const q = useInfiniteList({
    queryKey: ['user-activity', userId, filters],
    queryFn: ({ page, limit }) => getAuditByUser(userId, { ...filters, page, limit }),
    listKey: 'records',
    enabled: Boolean(userId),
  })

  return {
    activity: q.records,
    count: q.count,
    hasNextPage: q.hasNextPage,
    fetchNextPage: q.fetchNextPage,
    isFetchingNextPage: q.isFetchingNextPage,
    isPending: q.isPending,
  }
}
