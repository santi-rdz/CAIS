export default function DataField({ icon, label, value, multiline = false }) {
  return (
    <div className="space-y-1">
      {icon ? (
        <div className="text-5 flex items-center gap-1.5 font-medium text-zinc-400">
          {icon}
          <span>{label}</span>
        </div>
      ) : (
        <p className="text-6 font-medium text-zinc-400">{label}</p>
      )}
      <p
        className={`text-5 text-zinc-800 ${multiline ? 'whitespace-pre-wrap' : ''}`}
      >
        {value ?? <span className="text-zinc-300">—</span>}
      </p>
    </div>
  )
}
