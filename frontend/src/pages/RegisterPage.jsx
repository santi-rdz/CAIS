import CoordForm from '@features/users/CoordForm'
import InternForm from '@features/users/InternForm'
import { useInvitedUser } from '@features/users/useInvitedUser'
import { toastApiError } from '@lib/ApiError'
import { registroUsuario } from '@services/ApiUsers'
import { useMutation } from '@tanstack/react-query'
import Spinner from '@ui/Spinner'
import { toast } from 'sonner'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const { data: invitedUser, isLoading, isError } = useInvitedUser(token)

  const { mutate, isPending } = useMutation({
    mutationFn: registroUsuario,
    onSuccess: () => {
      toast.success('Registro completado exitosamente')
      navigate('/login')
    },
    onError: toastApiError,
  })

  function onSubmit(payload) {
    mutate({ token, ...payload })
  }

  if (!token) return <Navigate to="/login" replace />

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )

  if (isError)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
        <p className="font-medium text-red-700">Token inválido o expirado</p>
        <p className="text-5 mt-1 text-red-600">
          El enlace de registro no es válido o ya fue utilizado.
        </p>
      </div>
    )

  const { correo, rol } = invitedUser

  if (rol === 'COORDINADOR')
    return (
      <CoordForm
        registration
        email={correo}
        onSubmit={onSubmit}
        isPending={isPending}
      />
    )
  return (
    <InternForm
      registration
      email={correo}
      onSubmit={onSubmit}
      isPending={isPending}
    />
  )
}
