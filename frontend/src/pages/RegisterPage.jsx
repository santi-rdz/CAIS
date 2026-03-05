import CoordRegistrationForm from '@features/users/CoordRegistrationForm'
import InternRegistrationForm from '@features/users/InternRegistrationForm'
import { usePreUser } from '@features/users/usePreUser'
import { Navigate, useSearchParams } from 'react-router-dom'
import Spinner from '@ui/Spinner'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { data: preUser, isLoading, isError } = usePreUser(token)

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

  const { correo, rol } = preUser

  if (rol === 'COORDINADOR') return <CoordRegistrationForm email={correo} />
  return <InternRegistrationForm email={correo} />
}
