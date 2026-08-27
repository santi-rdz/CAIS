import { useMutation } from '@tanstack/react-query'
import { requestPasswordReset as apiRequestPasswordReset } from '@services/apiAuth'

export default function useRequestPasswordReset() {
  const {
    mutate: requestReset,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: apiRequestPasswordReset,
  })

  return { requestReset, isPending, isSuccess }
}
