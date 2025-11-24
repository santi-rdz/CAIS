import { login as loginApi } from '@services/apiAuth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      console.log(data)
      queryClient.setQueryData(['user'], data)
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return { login, isPending }
}
