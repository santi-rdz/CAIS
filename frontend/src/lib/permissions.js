import { ROLES, AREAS } from '@cais/shared/constants/users'

export const PERMISSIONS = {
  SEE_USER_AREA_COLUMN: 'SEE_USER_AREA_COLUMN',
  EDIT_PASANTE: 'EDIT_PASANTE',
  SEE_MEDICINA_STATS: 'SEE_MEDICINA_STATS',
}

const RULES = {
  [PERMISSIONS.SEE_USER_AREA_COLUMN]: (user) => user?.rol?.toUpperCase() === ROLES.ADMIN,
  [PERMISSIONS.EDIT_PASANTE]: (user) => user?.rol?.toUpperCase() === ROLES.COORDINADOR,
  [PERMISSIONS.SEE_MEDICINA_STATS]: (user) => user?.area?.toUpperCase() === AREAS.MEDICINA,
}

export function can(user, permission) {
  const rule = RULES[permission]
  return rule ? rule(user) : false
}

export function canSeeRoute(user, route) {
  if (!user) return false
  const rol = user.rol?.toUpperCase()
  const area = user.area?.toUpperCase()

  if (route.hiddenForRoles?.includes(rol)) return false
  if (rol === ROLES.ADMIN) return true
  if (route.areas && !route.areas.includes(area)) return false
  if (route.roles && !route.roles.includes(rol)) return false
  return true
}
