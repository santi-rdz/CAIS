import { getMe, logout as logoutApi } from '@services/ApiAuth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function useUser() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
    retry: false,
  })

  const logout = async () => {
    await logoutApi()
    queryClient.removeQueries({ queryKey: ['user'] })
    navigate('/login', { replace: true })
  }

  if (isError) return { isAuthenticated: false, logout }

  return {
    user,
    isPending: isLoading,
    isAuthenticated: Boolean(user?.id),
    logout,
  }
}
