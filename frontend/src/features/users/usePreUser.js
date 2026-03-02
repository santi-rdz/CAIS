import { useQuery } from '@tanstack/react-query'
import { validateToken } from '@services/ApiInvitaciones'

export function usePreUser(token) {
  return useQuery({
    queryKey: ['preUser', token],
    queryFn: () => validateToken(token),
    enabled: !!token,
    retry: false,
  })
}
