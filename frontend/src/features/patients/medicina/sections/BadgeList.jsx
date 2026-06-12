// Lista de badges para datos código-descripción (diagnósticos CIE-10 y
// similares), más legibles como etiquetas que como filas de campos.
export default function BadgeList({ items }) {
  if (!items?.length) return <p className="text-5 text-zinc-300">—</p>

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, index) => (
        <span
          key={it.id ?? `${it.label ?? 'item'}-${it.sub ?? ''}-${index}`}
          className="inline-flex items-baseline gap-2 rounded-lg bg-zinc-50 px-3 py-1.5"
        >
          <span className="text-5 font-semibold tracking-tight text-zinc-700 tabular-nums">
            {it.label}
          </span>
          {it.sub && <span className="text-6 text-zinc-500">{it.sub}</span>}
        </span>
      ))}
    </div>
  )
}
