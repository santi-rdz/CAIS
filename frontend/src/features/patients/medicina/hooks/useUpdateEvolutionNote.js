import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEvolutionNote } from '@services/apiEvolutionNotes'
import { toast } from 'sonner'

export function useUpdateEvolutionNote(pacienteId) {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateEvolutionNote(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['evolution-notes', pacienteId],
      })
      queryClient.invalidateQueries({ queryKey: ['evolution-note', id] })
    },
  })

  async function updateNote(id, data) {
    const promise = mutateAsync({ id, data })
    toast.promise(promise, {
      loading: 'Actualizando nota...',
      success: 'Nota de evolución actualizada',
      error: 'No se pudo actualizar la nota',
    })
    return promise
  }

  return { updateNote, isUpdating }
}
