import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/Select'
import { HiOutlineCalendarDays } from 'react-icons/hi2'
import { STATS_RANGES, STATS_RANGE_LABELS } from '@cais/shared/constants/stats'

// Selector de periodo (semana/mes/año) compartido por el dashboard y estadísticas.
export default function RangeSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-6 text-gray-400 max-sm:hidden">Periodo</span>
      <Select
        value={value}
        onValueChange={onChange}
        clearable={false}
        align="right"
        className="w-40"
      >
        <SelectTrigger icon={HiOutlineCalendarDays} size="md">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={STATS_RANGES.WEEK}>{STATS_RANGE_LABELS.week}</SelectItem>
          <SelectItem value={STATS_RANGES.MONTH}>{STATS_RANGE_LABELS.month}</SelectItem>
          <SelectItem value={STATS_RANGES.YEAR}>{STATS_RANGE_LABELS.year}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
