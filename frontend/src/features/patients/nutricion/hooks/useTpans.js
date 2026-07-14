import { useQuery } from '@tanstack/react-query'
import { getTpans } from '@services/apiTpan'

// Se monta solo al entrar al tab de TPAN (Tab.Panel desmonta los tabs
// inactivos), así que el fetch no carga la vista inicial del paciente.
export function useTpans(historiaId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['tpan-list', historiaId],
    queryFn: () => getTpans(historiaId),
    enabled: !!historiaId,
  })

  return { tpans: data?.tpans ?? [], isPending, isError, error }
}
