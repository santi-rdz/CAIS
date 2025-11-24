import { createPreUser as createPreUserApi } from '@services/ApiUsers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function useCreatePreUser() {
  const queryClient = useQueryClient()
  const { mutate: createPreUser, isPending: isCreating } = useMutation({
    mutationFn: createPreUserApi,
    onSuccess: () => {
      toast.success(`Usuario creado correctamente`)
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
  return { createPreUser, isCreating }
}
