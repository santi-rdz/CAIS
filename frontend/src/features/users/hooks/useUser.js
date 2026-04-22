import { getUser } from '@services/ApiUsers'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export function useUser() {
  const { id } = useParams()
  const { data: user, isPending } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
  })

  return { user, isPending }
}
