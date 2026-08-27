import { useQuery } from '@tanstack/react-query'
import { getResetTokenInfo } from '@services/apiAuth'

export default function useResetTokenInfo(token) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reset-token', token],
    queryFn: () => getResetTokenInfo(token),
    enabled: Boolean(token),
    retry: false,
  })

  return { correo: data?.correo, isLoading, isError }
}
