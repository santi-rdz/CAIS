import { getUser } from '@services/ApiUsers'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export function useUser(userId) {
  const { id: paramId } = useParams()
  const id = userId ?? paramId
  const { data: user, isPending } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  })

  return { user, isPending }
}
