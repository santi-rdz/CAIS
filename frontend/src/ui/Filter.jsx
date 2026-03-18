import { useContext } from 'react'
import { useSearchParams } from 'react-router'
import { HiOutlineFunnel, HiXMark } from 'react-icons/hi2'
import {
  Select,
  SelectContent,
  SelectContext,
  SelectFooter,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/Select'

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
      Limpiar filtros
    </button>
  )
}

/** Single-select group — se ve como RoleSelect. */
function SingleFilter({ group, placeholder }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const current = searchParams.get(group.field) ?? ''

  function handleChange(value) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set(group.field, value)
    if (newParams.get('page')) newParams.set('page', 1)
    setSearchParams(newParams)
  }

  function handleClear() {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete(group.field)
    if (newParams.get('page')) newParams.set('page', 1)
    setSearchParams(newParams)
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger icon={HiOutlineFunnel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup label={group.label}>
          {group.options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectFooter>
          <ClearButton onClear={handleClear} />
        </SelectFooter>
      </SelectContent>
    </Select>
  )
}

/** Multi-select groups combinados en un solo Select. */
function MultiFilter({ groups, placeholder }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const allValues = groups.flatMap((group) => {
    const raw = searchParams.get(group.field)
    if (!raw) return []
    return raw.split(',').map((v) => `${group.field}:${v}`)
  })

  function handleClearAll() {
    const newParams = new URLSearchParams(searchParams)
    groups.forEach((g) => newParams.delete(g.field))
    if (newParams.get('page')) newParams.set('page', 1)
    setSearchParams(newParams)
  }

  function handleValuesChange(next) {
    const perField = Object.fromEntries(groups.map((g) => [g.field, []]))
    for (const entry of next) {
      const [field, val] = entry.split(':')
      perField[field]?.push(val)
    }
    const newParams = new URLSearchParams(searchParams)
    for (const [field, vals] of Object.entries(perField)) {
      if (vals.length === 0) newParams.delete(field)
      else newParams.set(field, vals.join(','))
    }
    if (newParams.get('page')) newParams.set('page', 1)
    setSearchParams(newParams)
  }

  return (
    <Select multiple values={allValues} onValuesChange={handleValuesChange}>
      <SelectTrigger icon={HiOutlineFunnel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group, i) => (
          <SelectGroup key={group.field} label={group.label} separator={i > 0}>
            {group.options.map((opt) => (
              <SelectItem
                key={`${group.field}:${opt.value}`}
                value={`${group.field}:${opt.value}`}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
        <SelectFooter>
          <ClearButton onClear={handleClearAll} />
        </SelectFooter>
      </SelectContent>
    </Select>
  )
}

/**
 * Filter dropdown. Soporta grupos single-select y multi-select.
 * @param {Array} groups - [{ label, field, single?, options: [{ label, value }] }]
 */
export default function Filter({ groups, placeholder = 'Filtrar' }) {
  const singleGroups = groups.filter((g) => g.single)
  const multiGroups = groups.filter((g) => !g.single)

  return (
    <>
      {singleGroups.map((group) => (
        <SingleFilter
          key={group.field}
          group={group}
          placeholder={placeholder}
        />
      ))}
      {multiGroups.length > 0 && (
        <MultiFilter groups={multiGroups} placeholder={placeholder} />
      )}
    </>
  )
}
