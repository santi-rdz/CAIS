import { getUser as getUserApi } from '@services/ApiUsers'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function useUser() {
  const queryClient = useQueryClient()
  const userQuery = queryClient.getQueryData(['user']) || null

  const { data: user, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserApi(userQuery.id),
    retry: false,
  })
  if (!userQuery) return { isAuthenticated: false }
  return { user, isPending, isAuthenticated: Boolean(user?.id) }
}
