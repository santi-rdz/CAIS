import { formatFecha, formatHora } from '@lib/dateHelpers'

export default function DateTime({ value }) {
  if (!value) return <span className="text-zinc-400">---</span>

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm text-zinc-800">{formatFecha(value)}</span>
      <span className="text-xs text-zinc-400">{formatHora(value)}</span>
    </div>
  )
}
