import { useQuery } from '@tanstack/react-query'
import { getBiochemicalEvals } from '@services/apiBiochemicalEval'

// Se monta solo cuando el usuario entra al tab de Bioquímica (Tab.Panel
// desmonta los tabs inactivos), así que el fetch no carga la vista inicial
// del paciente.
export function useBiochemicalEvals(historiaId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['biochemical-evals', historiaId],
    queryFn: () => getBiochemicalEvals(historiaId),
    enabled: !!historiaId,
  })

  return { evaluations: data?.evaluations ?? [], isPending, isError, error }
}
