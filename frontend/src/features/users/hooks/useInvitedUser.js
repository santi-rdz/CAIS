import { useQuery } from '@tanstack/react-query'
import { validateToken } from '@services/ApiInvitations'

export function useInvitedUser(token) {
  return useQuery({
    queryKey: ['invitedUser', token],
    queryFn: () => validateToken(token),
    enabled: !!token,
    retry: false,
  })
}
