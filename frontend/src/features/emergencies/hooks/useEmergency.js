import { getEmergency } from '@services/ApiEmergencies'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export function useEmergency() {
  const { id } = useParams()

  const { data: emergency, isPending } = useQuery({
    queryKey: ['emergency', id],
    queryFn: () => getEmergency(id),
  })

  return { emergency, isPending }
}
