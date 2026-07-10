import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPhysicalExam } from '@services/apiPhysicalExam'
import { toastApiError } from '@lib/ApiError'

export function useCreatePhysicalExam(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync: createExam, isPending: isCreating } = useMutation({
    mutationFn: (data) => createPhysicalExam(data),
    onSuccess: () => {
      toast.success('Examen físico guardado')
      queryClient.invalidateQueries({ queryKey: ['physical-exams', historiaId] })
    },
    onError: toastApiError,
  })

  return { createExam, isCreating }
}
