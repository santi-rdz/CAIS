import { useInfiniteList } from '@hooks/useInfiniteList'
import { getEvolutionNotes } from '@services/apiEvolutionNotes'

export function useEvolutionNotes(historia_medica_id) {
  return useInfiniteList({
    queryKey: ['evolution-notes', historia_medica_id],
    queryFn: ({ page, limit }) => getEvolutionNotes(historia_medica_id, { page, limit }),
    listKey: 'notes',
    enabled: Boolean(historia_medica_id),
  })
}
