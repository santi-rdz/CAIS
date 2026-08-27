import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { resetPassword as apiResetPassword } from '@services/apiAuth'

export default function useResetPassword() {
  const navigate = useNavigate()
  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: apiResetPassword,
    onSuccess: () => {
      toast.success('Contraseña actualizada exitosamente', {
        description: 'Ya puedes iniciar sesión con tu nueva contraseña.',
      })
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      toast.error(error.message, { position: 'top-center' })
    },
  })

  return { resetPassword, isPending }
}
