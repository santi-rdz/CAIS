import useMe from '@features/users/hooks/useMe'
import { can as canFn } from '@lib/permissions'
import { ROLES, AREAS } from '@cais/shared/constants/users'

export default function usePermissions() {
  const { user } = useMe()

  const rol = user?.rol?.toUpperCase()
  const area = user?.area?.toUpperCase()

  return {
    user,
    rol,
    area,
    can: (permission) => canFn(user, permission),
    isAdmin: rol === ROLES.ADMIN,
    isCoordinador: rol === ROLES.COORDINADOR,
    isPasante: rol === ROLES.PASANTE,
    isMedicina: area === AREAS.MEDICINA,
    isNutricion: area === AREAS.NUTRICION,
  }
}
