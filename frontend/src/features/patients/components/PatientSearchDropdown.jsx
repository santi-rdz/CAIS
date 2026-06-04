import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Input from '@components/Input'
import DropdownPanel from '@components/DropdownPanel'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { getPatients } from '@services/apiPatient'
import useDropdownPosition from '@hooks/useDropdownPosition'
import { useRecentPatientSearches } from '@features/patients/hooks/useRecentPatientSearches'
import PatientSearchList from '@features/patients/components/PatientSearchList'
import PatientSearchSkeleton from '@features/patients/components/PatientSearchSkeleton'

export default function PatientSearchDropdown({ className }) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceRef = useRef(null)
  const navigate = useNavigate()
  const { recent, add: addRecent, clear: clearRecent } = useRecentPatientSearches()

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const { triggerRef, isOpen, positionStyle, open, close } = useDropdownPosition(320, {
    fullWidth: true,
    align: 'left',
  })

  const { data, isFetching } = useQuery({
    queryKey: ['patients-search', debouncedSearch],
    queryFn: () => getPatients({ search: debouncedSearch, page: 1 }),
    enabled: debouncedSearch.length >= 2,
    staleTime: 30_000,
  })

  const patients = data?.patients ?? []
  const isSearching = search.length >= 2
  const showRecent = !isSearching && recent.length > 0
  const debouncing = isSearching && debouncedSearch !== search
  const loading = debouncing || (isFetching && patients.length === 0)

  function handleFocus() {
    open()
  }

  function handleChange(e) {
    const val = e.target.value
    setSearch(val)
    clearTimeout(debounceRef.current)
    open()

    if (val.length >= 2) {
      debounceRef.current = setTimeout(() => setDebouncedSearch(val), 350)
    } else {
      setDebouncedSearch('')
    }
  }

  function handleSelect(patient) {
    clearTimeout(debounceRef.current)
    addRecent(patient)
    close()
    setSearch('')
    setDebouncedSearch('')
    navigate(`/pacientes/${patient.id}`)
  }

  function handleClearRecent() {
    clearRecent()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      clearTimeout(debounceRef.current)
      close()
      setSearch('')
      setDebouncedSearch('')
    }
  }

  const showHint = !isSearching && recent.length === 0

  return (
    <div ref={triggerRef} className={className}>
      <Input
        type="text"
        size="md"
        placeholder="Buscar paciente..."
        value={search}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        suffix={<HiMagnifyingGlass className="text-zinc-400" />}
      />
      {isOpen && (
        <DropdownPanel
          style={{ position: 'fixed', ...positionStyle }}
          className="overflow-hidden py-1.5"
        >
          {showHint && (
            <div className="flex items-center gap-2.5 px-3 py-3">
              <HiMagnifyingGlass size={14} className="shrink-0 text-zinc-300" />
              <p className="text-sm text-zinc-400">Busca por nombre o número de teléfono</p>
            </div>
          )}

          {showRecent && (
            <section>
              <div className="flex items-center justify-between px-3 pt-1 pb-1.5">
                <span className="text-xs font-medium text-zinc-400">Recientes</span>
                <button
                  type="button"
                  className="text-xs text-zinc-400 transition-colors hover:text-zinc-700"
                  onClick={handleClearRecent}
                >
                  Limpiar
                </button>
              </div>
              <PatientSearchList
                patients={recent}
                onSelect={handleSelect}
                className="max-h-[260px] overflow-y-auto"
              />
            </section>
          )}

          {isSearching && (
            <section>
              {loading ? (
                <PatientSearchSkeleton />
              ) : patients.length > 0 ? (
                <>
                  <p className="px-3 pt-1 pb-1.5 text-xs font-medium text-zinc-400">
                    {patients.length} resultado{patients.length !== 1 ? 's' : ''}
                  </p>
                  <PatientSearchList
                    patients={patients}
                    onSelect={handleSelect}
                    className="max-h-[340px] overflow-y-auto"
                  />
                </>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-zinc-500">
                    Sin resultados para{' '}
                    <span className="font-medium text-zinc-800">
                      &ldquo;{debouncedSearch}&rdquo;
                    </span>
                  </p>
                </div>
              )}
            </section>
          )}
        </DropdownPanel>
      )}
    </div>
  )
}
