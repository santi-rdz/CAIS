import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deletePhysicalExam } from '@services/apiPhysicalExam'
import { toastApiError } from '@lib/ApiError'

export function useDeletePhysicalExam(historiaId) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deletePhysicalExam(id),
    onSuccess: (_, id) => {
      toast.success('Examen físico eliminado')
      queryClient.invalidateQueries({ queryKey: ['physical-exams', historiaId] })
      queryClient.invalidateQueries({ queryKey: ['physical-exam', id] })
    },
    onError: toastApiError,
  })

  return { deleteExam: mutateAsync, isDeleting }
}
