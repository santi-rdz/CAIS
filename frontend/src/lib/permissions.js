import { ROLES, AREAS, ROLE_RANK } from '@cais/shared/constants/users'

export const PERMISSIONS = {
  SEE_USER_AREA_COLUMN: 'SEE_USER_AREA_COLUMN',
  EDIT_PASANTE: 'EDIT_PASANTE',
  SEE_MEDICINA_STATS: 'SEE_MEDICINA_STATS',
  SEE_NUTRICION_STATS: 'SEE_NUTRICION_STATS',
}

const RULES = {
  [PERMISSIONS.SEE_USER_AREA_COLUMN]: (user) => user?.rol?.toUpperCase() === ROLES.ADMIN,
  [PERMISSIONS.EDIT_PASANTE]: (user) => user?.rol?.toUpperCase() === ROLES.COORDINADOR,
  [PERMISSIONS.SEE_MEDICINA_STATS]: (user) => user?.area?.toUpperCase() === AREAS.MEDICINA,
  [PERMISSIONS.SEE_NUTRICION_STATS]: (user) => user?.area?.toUpperCase() === AREAS.NUTRICION,
}

export function can(user, permission) {
  const rule = RULES[permission]
  return rule ? rule(user) : false
}

// Desactivar/eliminar: solo cuentas de rango estrictamente menor, nunca la propia.
export function canManageUserAccount(actor, target) {
  if (!actor || !target || actor.id === target.id) return false
  const rank = (rol) => ROLE_RANK[rol?.toUpperCase()] ?? 0
  return rank(actor.rol) > rank(target.rol)
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
