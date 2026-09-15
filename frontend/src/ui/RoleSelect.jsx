import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/Select'

const BASE_OPTIONS = [
  { label: 'Pasante', value: 'pasante' },
  { label: 'Coordinador', value: 'coordinador' },
]

const ADMIN_OPTION = { label: 'Admin', value: 'admin' }

export default function RoleSelect({ role, setRole, className, allowAdmin = false }) {
  const options = allowAdmin ? [...BASE_OPTIONS, ADMIN_OPTION] : BASE_OPTIONS

  return (
    <Select value={role ?? ''} onValueChange={setRole} className={`w-fit ${className}`}>
      <SelectTrigger>
        <SelectValue placeholder="Rol" />
      </SelectTrigger>
      <SelectContent portal>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
