import useMe from '@features/users/hooks/useMe'
import { useUser } from '@features/users/hooks/useUser'

export function useMyProfile() {
  const { user: me } = useMe()
  return useUser(me?.id)
}
