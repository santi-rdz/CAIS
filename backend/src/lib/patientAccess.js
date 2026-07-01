import { ROLES } from '@cais/shared/constants/users'

/**
 * Política de acceso a un paciente por área. Admin ve todos; el resto solo los
 * pacientes de su misma área (`doctor_area_id`). Los controllers responden 404
 * en vez de 403 cuando falla, para no revelar la existencia del paciente.
 */
export function canAccessPatient(patient, session) {
  if (!patient) return false
  if (session.role === ROLES.ADMIN) return true
  return patient.doctor_area_id != null && patient.doctor_area_id === session.areaId
}
