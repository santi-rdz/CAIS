import { createInvitations as apiCreateInvitations } from '@services/ApiInvitations'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastApiError } from '@lib/ApiError'

export default function useCreateInvitations() {
  const queryClient = useQueryClient()

  const { mutate: createInvitations, isPending: isCreating } = useMutation({
    mutationFn: (invitations) => apiCreateInvitations(invitations),
    onSuccess: (data) => {
      const plural = data.created > 1 ? 's' : ''
      const intro = `${data.created} invitación${plural === 's' ? 'es' : ''} enviada${plural}`
      data.emailErrors.length > 0
        ? toast.success(
            `${intro} pero ${data.emailErrors.length} correos fallaron`,
            { icon: '⚠️' }
          )
        : toast.success(`${intro}`)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: toastApiError,
  })

  return { createInvitations, isCreating }
}
