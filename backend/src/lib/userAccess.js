import { ROLE_RANK } from '@cais/shared/constants/users'

/**
 * Política para desactivar/eliminar una cuenta: solo se puede sobre usuarios de
 * rango estrictamente menor, nunca sobre uno mismo ni un rango igual o mayor.
 * `target` viene del model (formatUser): `{ id, rol }`.
 */
export function canManageUserAccount(session, target) {
  if (!target || session.userId === target.id) return false
  return (ROLE_RANK[session.role] ?? 0) > (ROLE_RANK[target.rol] ?? 0)
}
