import dayjs from 'dayjs'
import { formatFecha } from '@lib/dateHelpers'

export default function BirthDate({ value }) {
  if (!value) return <span className="text-zinc-400">---</span>

  const age = dayjs().diff(dayjs(value), 'year')

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm text-zinc-800">{formatFecha(value)}</span>
      <span className="text-xs text-zinc-400">{age} años</span>
    </div>
  )
}
