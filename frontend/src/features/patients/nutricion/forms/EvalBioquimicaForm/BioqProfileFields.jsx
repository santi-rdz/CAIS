import FieldsSection from '@features/patients/shared/sections/FieldsSection'

// Vista de solo-lectura de un sub-perfil: misma config declarativa que
// ProfileFieldsGrid (form), pero resuelve el valor desde `evaluation` en vez
// de registrarlo en react-hook-form.
export default function BioqProfileFields({ fields, prefix, evaluation, cols = 3 }) {
  const sectionFields = fields.map(({ name, label, prefix: fieldPrefix }) => ({
    label,
    value: evaluation?.[fieldPrefix ?? prefix]?.[name] ?? null,
  }))

  return <FieldsSection fields={sectionFields} cols={cols} />
}
