import { createInvitaciones } from '@services/ApiInvitaciones'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useCreatePreUser() {
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['user'])

  const { mutate: createPreUser, isPending: isCreating } = useMutation({
    mutationFn: (invitaciones) => createInvitaciones(invitaciones, user?.id),
    onSuccess: (data) => {
      console.log(data)
      const plural = data.created > 1 ? 's' : ''
      const intro = `${data.created} usuario${plural} creado${plural}`
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
