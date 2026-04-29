import useMe from './useMe'
import { useUser } from './useUser'

export function useMyProfile() {
  const { user: me } = useMe()
  return useUser(me?.id)
}
