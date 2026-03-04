import { getUser as getUserApi } from '@services/ApiUsers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function useUser() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  // Intentar obtener usuario de localStorage primero
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const userFromStorage = storedUser ? JSON.parse(storedUser) : null
  
  // Si hay usuario en localStorage, usarlo como dato inicial
  if (userFromStorage && !queryClient.getQueryData(['user'])) {
    queryClient.setQueryData(['user'], userFromStorage)
  }
  
  const userQuery = queryClient.getQueryData(['user'])
  const hasUserId = !!userQuery?.id

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const userData = await getUserApi(userQuery.id)
        // Actualizar localStorage con datos frescos del backend
        localStorage.setItem('user', JSON.stringify(userData))
        return userData
      } catch (error) {
        // Si falla la petición, limpiar localStorage y redirect a login
        localStorage.removeItem('user')
        queryClient.removeQueries(['user'])
        navigate('/login', { replace: true })
        throw error
      }
    },
    retry: false,
    enabled: hasUserId,
  })

  const logout = () => {
    localStorage.removeItem('user')
    queryClient.removeQueries(['user'])
    navigate('/login', { replace: true })
  }

  // Si no hay usuario en storage, no está autenticado
  if (!userQuery) return { isAuthenticated: false }
  
  // Si no tiene ID válido, no está autenticado
  if (!hasUserId) return { isAuthenticated: false }
  
  // Si hay error en la query, no está autenticado
  if (isError) return { isAuthenticated: false }
  
  // isLoading es true solo la primera vez que se ejecuta la query con enabled: true
  return { user, isPending: isLoading, isAuthenticated: Boolean(user?.id), logout }
}
