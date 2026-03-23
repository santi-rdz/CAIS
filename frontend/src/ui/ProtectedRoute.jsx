import Spinner from '@components/Spinner'
import { Navigate } from 'react-router-dom'
import useUser from '@features/users/hooks/useUser'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isPending } = useUser()

  // Loading - solo mostrar spinner si está pendiente y hay usuario
  if (isPending)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    )

  // Not logged in → redirect
  if (!isAuthenticated) return <Navigate to="/login" replace />

  // Logged in → show app
  return children
}
