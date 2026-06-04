import { resendInvitation as apiResendInvitation } from '@services/apiInvitations'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useResendInvitation() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending: isResending } = useMutation({
    mutationFn: (correo) => apiResendInvitation(correo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  function resendInvitation(correo) {
    toast.promise(mutateAsync(correo), {
      loading: 'Enviando invitación...',
      success: 'Invitación reenviada exitosamente',
      error: (err) => err?.message ?? 'Error al reenviar la invitación',
    })
  }

  return { resendInvitation, isResending }
}
