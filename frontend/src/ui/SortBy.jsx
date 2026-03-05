import { useContext } from 'react'
import { useSearchParams } from 'react-router'
import { HiArrowsUpDown, HiXMark } from 'react-icons/hi2'
import {
  Select,
  SelectContent,
  SelectContext,
  SelectFooter,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/Select'

// Botón "Limpiar" que cierra el dropdown automáticamente
function ClearButton({ onClear }) {
  const { close } = useContext(SelectContext)
  return (
    <button
      type="button"
      onClick={() => {
        onClear()
        close()
      }}
      className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
    >
      <HiXMark size={15} />
      Limpiar ordenamiento
    </button>
  )
}

export default function SortBy({ options }) {
  const [params, setParams] = useSearchParams()
  const current = params.get('ordenarPor') ?? ''

  function handleChange(value) {
    params.set('ordenarPor', value)
    setParams(params)
  }

  function handleClear() {
    params.delete('ordenarPor')
    setParams(params)
  }

  const isGrouped = options.length > 0 && 'options' in options[0]

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger icon={HiArrowsUpDown}>
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        {isGrouped
          ? options.map((group, i) => (
              <SelectGroup
                key={group.label}
                label={group.label}
                separator={i > 0}
              >
                {group.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} icon={opt.icon}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          : options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
        <SelectFooter>
          <ClearButton onClear={handleClear} />
        </SelectFooter>
      </SelectContent>
    </Select>
  )
}
