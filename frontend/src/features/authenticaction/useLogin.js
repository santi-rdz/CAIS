import { login as loginApi } from '@services/ApiAuth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      queryClient.clear()
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'top-center',
        description: 'Verifica tus credenciales e inténtalo de nuevo.',
      })
    },
  })

  return { login, isPending }
}
