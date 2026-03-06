import { createUser as apiCreateUser } from '@services/ApiUsers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastApiError } from '@lib/ApiError'

export default function useCreateUser() {
  const queryClient = useQueryClient()

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: (data) => apiCreateUser(data),
    onSuccess: () => {
      toast.success('Usuario creado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: toastApiError,
  })

  return { createUser, isCreating }
}
