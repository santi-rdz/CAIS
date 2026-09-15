import { Navigate } from 'react-router-dom'
import usePermissions from '@hooks/usePermissions'

// El admin no tiene /dashboard en su nav; su landing es /usuarios.
export default function HomeRedirect() {
  const { isAdmin } = usePermissions()
  return <Navigate to={isAdmin ? '/usuarios' : '/dashboard'} replace />
}
