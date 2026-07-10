import { useQuery } from '@tanstack/react-query'
import { getRec24hs } from '@services/apiRec24h'

// Se monta solo al entrar al tab de Recordatorio 24h (Tab.Panel desmonta los
// tabs inactivos), así que el fetch no carga la vista inicial del paciente.
export function useRec24hs(historiaId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['rec-24h-list', historiaId],
    queryFn: () => getRec24hs(historiaId),
    enabled: !!historiaId,
  })

  return { recs: data?.recs ?? [], isPending, isError, error }
}
