import Empty from '@features/patients/medicina/sections/Empty'

// Tabla genérica para relaciones one-to-many (enfermedades, tratamientos…).
// columns: [{ key, label }]; rows: array de objetos.
export default function RecordTable({ columns, rows, emptyMessage }) {
  if (!rows?.length) return <Empty message={emptyMessage} />

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-6 px-3 py-2 font-semibold tracking-widest text-zinc-400 uppercase"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-zinc-50 last:border-0">
              {columns.map((col) => {
                const value = row[col.key]
                const hasValue = value != null && String(value).trim() !== ''
                return (
                  <td key={col.key} className="text-5 px-3 py-2.5 text-zinc-700">
                    {hasValue ? value : <span className="text-zinc-300">—</span>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
