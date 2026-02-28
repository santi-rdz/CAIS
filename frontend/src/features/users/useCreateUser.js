import { fullRegisterUser } from '@services/ApiUsers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useCreateUser() {
  const queryClient = useQueryClient()
  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: fullRegisterUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario creado exitosamente')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
  return { createUser, isCreating }
}
