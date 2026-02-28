import { deleteUser as deleteUserApi } from '@services/ApiUsers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useDeleteUser() {
  const queryClient = useQueryClient()
  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      toast.success('Usuario borrado exitosamente')
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
  return { deleteUser, isPending }
}
