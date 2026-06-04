import usePermissions from '@hooks/usePermissions'

export default function Can({ permission, fallback = null, children }) {
  const { can } = usePermissions()
  return can(permission) ? children : fallback
}
