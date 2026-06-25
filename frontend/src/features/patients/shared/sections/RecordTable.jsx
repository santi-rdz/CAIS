import { useState } from 'react'
import { HiOutlinePencilSquare } from 'react-icons/hi2'

const TRUNCATE_AT = 80

function TruncatedCell({ value }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = typeof value === 'string' && value.length > TRUNCATE_AT

  if (!isLong) return value

  const toggle = (e) => {
    e.stopPropagation()
    setExpanded((v) => !v)
  }

  const btn = (
    <button
      type="button"
      onClick={toggle}
      className="ml-1 text-zinc-400 underline transition-colors hover:text-zinc-600"
    >
      {expanded ? 'ver menos' : 'ver más'}
    </button>
  )

  return (
    <div className="max-w-[280px] break-words">
      {expanded ? value : `${value.slice(0, TRUNCATE_AT)}…`}
      {btn}
    </div>
  )
}

// Tabla genérica para relaciones one-to-many.
// columns: [{ key, label, format? }]
// onEdit(row): añade columna de acción con ícono editar.
export default function RecordTable({ columns, rows, emptyMessage = 'Sin registros.', onEdit }) {
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
            {onEdit && <th className="w-8" />}
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
                  const raw = row[col.key]
                  const display = col.format ? col.format(raw) : raw
                  const hasValue = display != null && String(display).trim() !== ''
                  return (
                    <td key={col.key} className="text-5 px-3 py-2.5 text-zinc-700">
                      {hasValue ? (
                        <TruncatedCell value={display} />
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                  )
                })}
                {onEdit && (
                  <td className="px-2 py-2.5">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                      aria-label="Editar fila"
                    >
                      <HiOutlinePencilSquare size={15} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (onEdit ? 1 : 0)}
                className="text-6 px-3 py-3 text-zinc-300"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
