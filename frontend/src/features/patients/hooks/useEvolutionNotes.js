import { useQuery } from '@tanstack/react-query'
import { getEvolutionNotes } from '@services/apiEvolutionNotes'

export function useEvolutionNotes(paciente_id) {
  const { data, isPending } = useQuery({
    queryKey: ['evolution-notes', paciente_id],
    queryFn: () => getEvolutionNotes(paciente_id),
    enabled: Boolean(paciente_id),
  })

  return { notes: data?.notes ?? [], isPending }
}
