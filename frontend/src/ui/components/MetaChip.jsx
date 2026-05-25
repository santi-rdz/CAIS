export default function MetaChip({ icon, value, className = '' }) {
  return (
    <span 
      className={`inline-flex max-w-[250px] items-center gap-1.5 rounded-md bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 sm:max-w-[400px] ${className}`}
    >
      <span className="shrink-0 text-zinc-400">{icon}</span>
      <span className="truncate" title={typeof value === 'string' ? value : undefined}>
        {value}
      </span>
    </span>
  )
}
