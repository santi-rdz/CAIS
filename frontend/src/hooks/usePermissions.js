import useMe from '@features/users/hooks/useMe'
import { can as canFn } from '@lib/permissions'
import { ROLES, AREAS } from '@cais/shared/constants/users'

export default function usePermissions() {
  const { user } = useMe()

  return {
    user,
    can: (permission) => canFn(user, permission),
    isAdmin: user?.rol === ROLES.ADMIN,
    isCoordinador: user?.rol === ROLES.COORDINADOR,
    isPasante: user?.rol === ROLES.PASANTE,
    isMedicina: user?.area === AREAS.MEDICINA,
    isNutricion: user?.area === AREAS.NUTRICION,
  }
}
