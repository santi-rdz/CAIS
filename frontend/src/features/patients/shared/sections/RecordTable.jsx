import { useState } from 'react'
import { HiOutlinePencilSquare, HiOutlineInbox } from 'react-icons/hi2'
import EmptyState from '@components/EmptyState'

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
// emptyIcon / emptyMessage: estado vacío (centrado, sin chrome de tabla).
export default function RecordTable({
  columns,
  rows,
  emptyMessage = 'Sin registros.',
  emptyIcon,
  onEdit,
}) {
  const hasRows = rows?.length > 0

  if (!hasRows) {
    return <EmptyState icon={emptyIcon ?? <HiOutlineInbox size={24} />} message={emptyMessage} />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-100">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-7 px-4 py-2.5 font-semibold tracking-wider text-zinc-400 uppercase"
              >
                {col.label}
              </th>
            ))}
            {onEdit && <th className="w-12" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/60"
            >
              {columns.map((col, idx) => {
                const raw = row[col.key]
                const display = col.format ? col.format(raw) : raw
                const hasValue = display != null && String(display).trim() !== ''
                const isFirst = idx === 0
                return (
                  <td
                    key={col.key}
                    className={`text-5 px-4 py-3 ${
                      isFirst ? 'font-medium text-zinc-800' : 'text-zinc-600'
                    }`}
                  >
                    {hasValue ? (
                      <TruncatedCell value={display} />
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                )
              })}
              {onEdit && (
                <td className="px-2 py-3">
                  <button
                    type="button"
                    onClick={() => onEdit(row)}
                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                    aria-label="Editar fila"
                  >
                    <HiOutlinePencilSquare size={15} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
