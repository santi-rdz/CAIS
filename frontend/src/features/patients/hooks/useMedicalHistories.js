import { useQuery } from '@tanstack/react-query'
import { getMedicalHistories } from '@services/apiMedicalHistory'

export function useMedicalHistories(pacienteId) {
  const { data, isPending } = useQuery({
    queryKey: ['medical-histories', pacienteId],
    queryFn: () => getMedicalHistories(pacienteId),
    enabled: !!pacienteId,
  })

  return { histories: data?.histories ?? [], isPending }
}
