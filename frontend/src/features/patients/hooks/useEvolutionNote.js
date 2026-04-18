import { useQuery } from '@tanstack/react-query'
import { getEvolutionNoteById } from '@services/apiEvolutionNotes'

export function useEvolutionNote(id) {
  const { data, isPending } = useQuery({
    queryKey: ['evolution-note', id],
    queryFn: () => getEvolutionNoteById(id),
    enabled: Boolean(id),
  })

  return { note: data ?? null, isPending }
}
