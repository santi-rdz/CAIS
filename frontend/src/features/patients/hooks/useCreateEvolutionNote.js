import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEvolutionNote } from '@services/apiEvolutionNotes'
import { toast } from 'sonner'

export function useCreateEvolutionNote(pacienteId) {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending: isCreating } = useMutation({
    mutationFn: (data) => createEvolutionNote(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['evolution-notes', pacienteId],
      }),
  })

  function createNote(data) {
    const promise = mutateAsync(data)
    return toast.promise(promise, {
      loading: 'Guardando nota...',
      success: 'Nota de evolución guardada',
      error: 'No se pudo guardar la nota',
    })
  }

  return { createNote, isCreating }
}
