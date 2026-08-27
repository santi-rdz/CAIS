import { deleteUser as apiDeleteUser } from '@services/apiUsers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastApiError } from '@lib/ApiError'

export default function useDeleteUser() {
  const queryClient = useQueryClient()

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (id) => apiDeleteUser(id),
    onSuccess: () => {
      toast.success('Usuario eliminado')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: toastApiError,
  })

  return { deleteUser, isDeleting }
}
