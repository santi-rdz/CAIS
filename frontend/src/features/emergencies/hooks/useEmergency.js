import { getEmergency } from '@services/apiEmergencies'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export function useEmergency() {
  const { id } = useParams()

  const { data: emergency, isPending } = useQuery({
    queryKey: ['emergency', id],
    queryFn: () => getEmergency(id),
  })

  return { emergency, isPending }
}
