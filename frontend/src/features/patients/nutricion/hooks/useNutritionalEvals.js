import { useQuery } from '@tanstack/react-query'
import { getNutritionalEvals } from '@services/apiNutritionalEval'

// Se monta solo al entrar al tab de Frecuencia y Hábitos (Tab.Panel desmonta los
// tabs inactivos), así que el fetch no carga la vista inicial del paciente.
export function useNutritionalEvals(historiaId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['nutritional-evals', historiaId],
    queryFn: () => getNutritionalEvals(historiaId),
    enabled: !!historiaId,
  })

  return { evaluations: data?.evals ?? [], isPending, isError, error }
}
