import { useQuery } from '@tanstack/react-query'
import { getEvolutionNotes } from '@services/apiEvolutionNotes'

export function useEvolutionNotes(historia_medica_id) {
  const { data, isPending } = useQuery({
    queryKey: ['evolution-notes', historia_medica_id],
    queryFn: () => getEvolutionNotes(historia_medica_id),
    enabled: Boolean(historia_medica_id),
  })

  return { notes: data?.notes ?? [], isPending }
}
