import { useState, useEffect, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2'
import Input from '@components/Input'
import DropdownPanel from '@components/DropdownPanel'
import useDropdownPosition from '@hooks/useDropdownPosition'
import { searchIcd11 } from '@services/apiIcd11'

export default function CIE10Field({ name = 'planes_estudio.cie10_codes' }) {
  const { control } = useFormContext()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const { triggerRef, isOpen, positionStyle, open, close } =
    useDropdownPosition(320)
  const debounceRef = useRef(null)
  const requestSeqRef = useRef(0)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 1) {
      requestSeqRef.current += 1
      setResults([])
      setIsLoading(false)
      setSearchError(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const seq = ++requestSeqRef.current
      setIsLoading(true)
      setSearchError(false)
      try {
        const data = await searchIcd11(q)
        if (seq !== requestSeqRef.current) return
        setResults(data.slice(0, 8))
      } catch {
        if (seq !== requestSeqRef.current) return
        setResults([])
        setSearchError(true)
      } finally {
        if (seq === requestSeqRef.current) setIsLoading(false)
      }
    }, 350)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  function openPanel() {
    open()
    triggerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value: selected = [], onChange } }) => {
        const selectedCodigos = selected.map((c) => c.codigo)

        function handleSelect(code) {
          if (!selectedCodigos.includes(code.codigo))
            onChange([...selected, code])
          setQuery('')
          setResults([])
          close()
        }

        function handleRemove(codigo) {
          onChange(selected.filter((c) => c.codigo !== codigo))
        }

        return (
          <div className="space-y-3">
            {/* Input */}
            <div ref={triggerRef}>
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  if (e.target.value.trim().length >= 1) openPanel()
                  else close()
                }}
                onFocus={() => {
                  if (query.trim().length >= 1) openPanel()
                  else {
                    triggerRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }
                }}
                placeholder="Buscar por código o descripción..."
                variant="outline"
                size="md"
                suffix={<HiMagnifyingGlass className="text-zinc-400" />}
              />
            </div>

            {/* Dropdown */}
            {isOpen && query.trim().length >= 1 && (
              <DropdownPanel
                style={{
                  position: 'fixed',
                  zIndex: 9999,
                  ...positionStyle,
                  width: triggerRef.current?.offsetWidth,
                }}
                className="overflow-hidden p-1.5"
              >
                {isLoading ? (
                  <p className="px-3 py-2.5 text-sm text-zinc-400">
                    Buscando...
                  </p>
                ) : searchError ? (
                  <p className="px-3 py-2.5 text-sm text-red-500">
                    Error al conectar con la API de ICD-11
                  </p>
                ) : results.length > 0 ? (
                  results.map((code) => (
                    <button
                      key={code.codigo}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleSelect(code)
                      }}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-zinc-50"
                    >
                      <span className="shrink-0 font-mono text-sm font-semibold text-green-800">
                        {code.codigo}
                      </span>
                      <span className="text-sm text-zinc-600">
                        {code.descripcion}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2.5 text-sm text-zinc-400">
                    Sin resultados para `{query}`
                  </p>
                )}
              </DropdownPanel>
            )}

            {/* Chips */}
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.map((code) => (
                  <div
                    key={code.codigo}
                    className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 py-1 pr-2 pl-3"
                  >
                    <span className="font-mono text-sm font-semibold text-green-800">
                      {code.codigo}
                    </span>
                    <span className="max-w-[22ch] truncate text-xs text-zinc-600">
                      {code.descripcion}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(code.codigo)}
                      className="flex size-4 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-600"
                    >
                      <HiXMark size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selected.length === 0 && (
              <p className="text-xs text-zinc-400">
                Código ICD-11 — selecciona todos los diagnósticos
                correspondientes
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
