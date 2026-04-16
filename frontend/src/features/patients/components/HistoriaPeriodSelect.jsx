import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@components/Select'

export default function HistoriaPeriodSelect({ value, onChange, periodos }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periodos.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
