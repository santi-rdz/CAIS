import { ROLES } from '@cais/shared/constants/users'

/**
 * Política de acceso a un paciente por área. Admin ve todos; el resto solo los
 * pacientes con membresía en su misma área (`patient.areas`). Los controllers
 * responden 404 en vez de 403 cuando falla, para no revelar la existencia del
 * paciente.
 */
export function canAccessPatient(patient, session) {
  if (!patient) return false
  if (session.role === ROLES.ADMIN) return true
  return session.areaId != null && patient.areas.includes(session.areaId)
}
