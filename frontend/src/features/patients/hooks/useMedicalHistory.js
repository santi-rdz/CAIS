import { useQuery } from '@tanstack/react-query'
import { getMedicalHistory } from '@services/apiMedicalHistory'

export function useMedicalHistory(id) {
  const { data: historia, isPending } = useQuery({
    queryKey: ['medical-history', id],
    queryFn: () => getMedicalHistory(id),
    enabled: !!id,
  })

  return { historia, isPending }
}
