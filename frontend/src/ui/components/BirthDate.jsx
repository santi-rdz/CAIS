import dayjs from 'dayjs'
import { formatFecha } from '@lib/dateHelpers'

export default function BirthDate({ value }) {
  if (!value) return <span className="text-zinc-400 italic">---</span>

  const age = dayjs().diff(dayjs(value), 'year')

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-zinc-700">{formatFecha(value)}</span>
      <span className="text-sm text-zinc-500">{age} años</span>
    </div>
  )
}
