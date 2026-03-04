import { login as loginApi } from '@services/ApiAuth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem('userId', data.id)
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return { login, isPending }
}
