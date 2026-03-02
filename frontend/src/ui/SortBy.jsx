import { useSearchParams } from 'react-router'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select'

export default function SortBy({ options }) {
  const [params, setParams] = useSearchParams()
  const current = params.get('ordenarPor') ?? ''

  function handleChange(value) {
    if (value === 'clear') {
      params.delete('ordenarPor')
      setParams(params)
    } else {
      params.set('ordenarPor', value)
      setParams(params)
    }
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} hideRadio={option.value === 'clear'}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
