import { createInvitaciones } from '@services/ApiInvitaciones'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastApiError } from '@lib/ApiError'

export default function useCreatePreUser() {
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['user'])

  const { mutate: createPreUser, isPending: isCreating } = useMutation({
    mutationFn: (invitaciones) => createInvitaciones(invitaciones, user?.id),
    onSuccess: (data) => {
      const plural = data.created > 1 ? 's' : ''
      const intro = `${data.created} usuario${plural} creado${plural}`
      data.emailErrors.length > 0
        ? toast.success(`${intro} pero ${data.emailErrors.length} correos fallaron`, { icon: '⚠️' })
        : toast.success(` ${intro} y correo${plural} enviado${plural}!`)
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
    onError: toastApiError,
  })
  return { createPreUser, isCreating }
}
