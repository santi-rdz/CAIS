import { deleteInvitation as apiDeleteInvitation } from '@services/ApiInvitations'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastApiError } from '@lib/ApiError'

export default function useDeleteInvitation() {
  const queryClient = useQueryClient()

  const { mutate: deleteInvitation, isPending: isDeleting } = useMutation({
    mutationFn: (correo) => apiDeleteInvitation(correo),
    onSuccess: () => {
      toast.success('Invitación eliminada')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: toastApiError,
  })

  return { deleteInvitation, isDeleting }
}
