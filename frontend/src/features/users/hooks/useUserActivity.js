import { useQuery } from '@tanstack/react-query'
import { getAuditByUser } from '@services/apiAudit'

export function useUserActivity(userId, filters = {}) {
  const { data, isPending } = useQuery({
    queryKey: ['user-activity', userId, filters],
    queryFn: () => getAuditByUser(userId, filters),
    enabled: Boolean(userId),
  })

  return { activity: data?.records ?? [], count: data?.count ?? 0, isPending }
}
