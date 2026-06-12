import { formatFecha } from '@lib/dateHelpers'

// Devuelve los textos del shell (title, subtitle, description, submitLabel)
// según el modo del form de nutrición.
export function getFormCopy({
  isEdit,
  isClone,
  historiaOnly,
  patientOnly,
  historia,
  cloneHistoria,
}) {
  if (patientOnly) {
    return {
      title: 'Editar Info del Paciente',
      submitLabel: 'Actualizar paciente',
    }
  }
  if (isEdit) {
    return {
      title: historiaOnly ? 'Editar Historia Nutricional' : 'Editar Paciente',
      subtitle: historiaOnly && historia ? formatFecha(historia.fecha_ingreso) : undefined,
      submitLabel: historiaOnly ? 'Actualizar historia' : 'Actualizar paciente',
    }
  }
  if (isClone) {
    return {
      title: 'Nueva Historia Nutricional',
      subtitle: cloneHistoria ? formatFecha(cloneHistoria.fecha_ingreso) : undefined,
      description:
        'Se tomó la historia más reciente como base. Modifica los campos necesarios antes de guardar.',
      submitLabel: 'Crear historia',
    }
  }
  return {
    title: 'Registro de Nuevo Paciente',
    submitLabel: 'Registrar paciente',
  }
}
