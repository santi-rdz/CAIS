import { useSearchParams } from 'react-router-dom'

export default function Filter({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentFilter = searchParams.get(filterField) || options[0].value

  function handleClick(value) {
    if (value === 'default') {
      searchParams.delete('status')
      setSearchParams(searchParams)
      return
    }
    searchParams.set(filterField, value)
    // if (searchParams.get('page')) searchParams.set('page', 1)
    setSearchParams(searchParams)
  }

  return (
    <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-xs">
      {options.map((op) => (
        <button
          key={op.value}
          onClick={() => handleClick(op.value)}
          className={`rounded-md px-2 py-1 text-sm font-medium transition-all ${
            op.value === currentFilter ? 'pointer-events-none bg-green-800 text-blue-50' : 'bg-white hover:bg-gray-100'
          }`}
        >
          {op.label}
        </button>
      ))}
    </div>
  )
}
