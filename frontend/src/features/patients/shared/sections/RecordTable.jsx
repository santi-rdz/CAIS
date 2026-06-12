// Tabla genérica para relaciones one-to-many (enfermedades, tratamientos,
// adicciones). columns: [{ key, label }]; rows: array de objetos.
// Siempre se muestra la tabla; sin filas se renderiza una fila tenue en vez de
// un empty state centrado.
export default function RecordTable({ columns, rows, emptyMessage = 'Sin registros.' }) {
  const hasRows = rows?.length > 0

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-6 px-3 py-2 font-medium tracking-wide text-zinc-400 uppercase"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasRows ? (
            rows.map((row, i) => (
              <tr
                key={row.id ?? i}
                className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/70"
              >
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
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-6 px-3 py-3 text-zinc-300">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
