import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/Select'
import { AREAS, AREA_LABELS } from '@cais/shared/constants/users'

export default function AreaSelect({
  value,
  onValueChange,
  hasError,
  fullWidth = false,
  className,
}) {
  return (
    <Select
      value={value ?? ''}
      onValueChange={onValueChange}
      hasError={hasError}
      fullWidth={fullWidth}
      className={className}
    >
      <SelectTrigger>
        <SelectValue placeholder="Área" />
      </SelectTrigger>
      <SelectContent portal>
        {Object.values(AREAS).map((area) => (
          <SelectItem key={area} value={area}>
            {AREA_LABELS[area]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
