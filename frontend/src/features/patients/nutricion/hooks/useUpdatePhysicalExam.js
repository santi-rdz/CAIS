import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updatePhysicalExam } from '@services/apiPhysicalExam'
import { toastApiError } from '@lib/ApiError'

export function useUpdatePhysicalExam(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateExam, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updatePhysicalExam(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Examen físico actualizado')
      queryClient.invalidateQueries({ queryKey: ['physical-exams', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['physical-exam', id] })
    },
    onError: toastApiError,
  })

  return { updateExam, isUpdating }
}
