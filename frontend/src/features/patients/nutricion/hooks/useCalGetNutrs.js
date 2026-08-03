import { useQuery } from '@tanstack/react-query'
import { getCalGetNutrs } from '@services/apiCalGetNutr'

// Se monta solo al entrar al tab (Tab.Panel desmonta los inactivos), así que el
// fetch no carga la vista inicial del paciente.
export function useCalGetNutrs(historiaId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['cal-get-nutr-list', historiaId],
    queryFn: () => getCalGetNutrs(historiaId),
    enabled: !!historiaId,
  })

  return { registros: data?.registros ?? [], isPending, isError, error }
}
