export default function DataField({
  icon,
  label,
  value,
  multiline = false,
  block = false,
}) {
  const hasValue = value != null && String(value).trim() !== ''

  return (
    <div className="space-y-1">
      {icon ? (
        <div className="text-5 flex items-center gap-1.5 font-medium text-zinc-400">
          {icon}
          <span>{label}</span>
        </div>
      ) : (
        <p className="text-6 font-semibold tracking-widest text-zinc-400 uppercase">
          {label}
        </p>
      )}
      <p
        className={`text-5 text-zinc-800 ${multiline && hasValue ? 'whitespace-pre-wrap' : ''} ${block && hasValue ? 'rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 leading-relaxed' : ''}`}
      >
        {hasValue ? value : <span className="text-zinc-300">—</span>}
      </p>
    </div>
  )
}
