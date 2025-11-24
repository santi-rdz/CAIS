import { getUsers } from '@services/ApiUsers'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

export function useUsers() {
  const [params] = useSearchParams()
  const status = params.get('status')

  const { data: users, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ status }),
  })
  return { users, isPending }
}
