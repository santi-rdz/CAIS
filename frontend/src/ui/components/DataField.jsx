// Átomo base para mostrar un dato: label (consistente, micro-uppercase, opcional
// con ícono) + valor. El valor puede ser string o nodo (p.ej. número + unidad +
// badge). Sin cajas por defecto — `block` solo aplica un panel suave para texto
// largo. Vacío = "—" tenue. Una sola variante para todo el sistema.
export default function DataField({ icon, label, value, multiline = false, block = false }) {
  const isString = typeof value === 'string'
  const has = value != null && (!isString || value.trim() !== '')

  return (
    <div className="space-y-1">
      <p className="text-6 flex items-center gap-1.5 font-medium tracking-wide text-zinc-400 uppercase">
        {icon && <span className="text-zinc-300">{icon}</span>}
        {label}
      </p>
      <p
        className={`text-5 leading-relaxed ${has ? 'text-zinc-700' : 'text-zinc-300'} ${
          multiline && has && isString ? 'whitespace-pre-wrap' : ''
        } ${block && has ? 'mt-1.5 rounded-lg bg-zinc-50 px-3.5 py-2.5' : ''}`}
      >
        {has ? value : '—'}
      </p>
    </div>
  )
}
