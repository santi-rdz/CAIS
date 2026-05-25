import { formatFecha, formatHora } from '@lib/dateHelpers'

export default function DateTime({ value }) {
  if (!value) return <span className="text-zinc-400 italic">---</span>

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-zinc-700">{formatFecha(value)}</span>
      <span className="text-sm text-zinc-500">{formatHora(value)}</span>
    </div>
  )
}
