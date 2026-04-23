import { updateUser as apiUpdateUser } from '@services/ApiUsers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastApiError } from '@lib/ApiError'

export default function useUpdateUser() {
  const queryClient = useQueryClient()

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => apiUpdateUser(id, data),
    onSuccess: (updatedUser) => {
      toast.success('Usuario actualizado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.setQueryData(['user', updatedUser.id], updatedUser)
    },
    onError: toastApiError,
  })

  return { updateUser, isUpdating }
}
