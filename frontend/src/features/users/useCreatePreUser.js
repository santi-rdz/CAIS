import { createPreUser as createPreUserApi } from '@services/ApiUsers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useCreatePreUser() {
  const queryClient = useQueryClient()
  const { mutate: createPreUser, isPending: isCreating } = useMutation({
    mutationFn: createPreUserApi,
    onSuccess: (data) => {
      const plural = data.users.length > 1 ? 's' : ''
      const intro = `${data.users.length} usuario${plural} creado${plural}`
      data.emailErrors.length > 0
        ? toast.success(`${intro} pero ${data.emailErrors.length} correos fallaron`, { icon: '⚠️' })
        : toast.success(` ${intro} y correo${plural} enviado${plural}!`)
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
