import { useQuery } from '@tanstack/react-query'
import { getEvolutionNotes } from '@services/apiEvolutionNotes'

export function useEvolutionNotes(paciente_id, historia_medica_id) {
  const { data, isPending } = useQuery({
    queryKey: ['evolution-notes', paciente_id, historia_medica_id],
    queryFn: () => getEvolutionNotes(paciente_id, historia_medica_id),
    enabled: Boolean(paciente_id) && Boolean(historia_medica_id),
  })

  return { notes: data?.notes ?? [], isPending }
}
