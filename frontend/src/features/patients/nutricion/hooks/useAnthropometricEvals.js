import { useQuery } from '@tanstack/react-query'
import { getAnthropometricEvals } from '@services/apiAntropometrica'

// Se monta solo al entrar al tab de antropometría (Tab.Panel desmonta los tabs
// inactivos), así que el fetch no carga la vista inicial del paciente.
export function useAnthropometricEvals(historiaId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['antro-list', historiaId],
    queryFn: () => getAnthropometricEvals(historiaId),
    enabled: !!historiaId,
  })

  return { evals: data?.evals ?? [], isPending, isError, error }
}
