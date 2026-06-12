import DataField from '@components/DataField'

const GRID = {
  1: 'grid-cols-1',
  2: 'grid-cols-2 max-sm:grid-cols-1',
  3: 'grid-cols-3 max-sm:grid-cols-2',
}

// Rejilla de campos: cada campo es un slot etiquetado (el doctor ve SIEMPRE qué
// existe en la sección, aunque esté vacío). Usa el DataField core; el ritmo lo da
// el espaciado, sin líneas divisoras.
export default function FieldsSection({ fields, cols = 2 }) {
  return (
    <div className={`grid ${GRID[cols] ?? GRID[2]} gap-x-8 gap-y-4`}>
      {(fields ?? []).map((f) => (
        <DataField key={f.label} label={f.label} value={f.value} multiline />
      ))}
    </div>
  )
}
