import { getUser as getUserApi } from '@services/ApiUsers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function useUser() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        return await getUserApi(userId)
      } catch (error) {
        localStorage.removeItem('userId')
        queryClient.removeQueries({ queryKey: ['user'] })
        navigate('/login', { replace: true })
        throw error
      }
    },
    retry: false,
    enabled: !!userId,
  })

  const logout = () => {
    localStorage.removeItem('userId')
    queryClient.removeQueries({ queryKey: ['user'] })
    navigate('/login', { replace: true })
  }

  if (!userId) return { isAuthenticated: false }
  if (isError) return { isAuthenticated: false }

  return { user, isPending: isLoading, isAuthenticated: Boolean(user?.id), logout }
}
