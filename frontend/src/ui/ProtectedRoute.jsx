import Spinner from './Spinner'
import { Navigate } from 'react-router-dom'
import useUser from '@features/users/useUser'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isPending } = useUser()

  // Loading
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
