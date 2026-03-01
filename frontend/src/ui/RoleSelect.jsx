import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select'

const options = [
  { label: 'Pasante', value: 'pasante' },
  { label: 'Coordinador', value: 'coordinador' },
]

export default function RoleSelect({ role, setRole, className }) {
  return (
    <Select value={role ?? ''} onValueChange={setRole} className={`w-fit ${className}`}>
      <SelectTrigger>
        <SelectValue placeholder="Rol" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
