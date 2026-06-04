import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Input from '@components/Input'
import DropdownPanel from '@components/DropdownPanel'
import { HiMagnifyingGlass, HiOutlineClock, HiOutlineUser } from 'react-icons/hi2'
import { getPatients } from '@services/apiPatient'
import useDropdownPosition from '@hooks/useDropdownPosition'
import { useRecentPatientSearches } from '@features/patients/hooks/useRecentPatientSearches'
import { formatRelativo } from '@lib/dateHelpers'

export default function PatientSearchDropdown({ className }) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceRef = useRef(null)
  const navigate = useNavigate()
  const { recent, add: addRecent, clear: clearRecent } = useRecentPatientSearches()

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
              <div className="flex items-center justify-between px-3 pt-0.5 pb-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                  <HiOutlineClock size={11} />
                  Recientes
                </span>
                <button
                  type="button"
                  className="text-xs text-zinc-400 transition-colors hover:text-zinc-600"
                  onClick={handleClearRecent}
                >
                  Limpiar
                </button>
              </div>
              <PatientList
                patients={recent}
                onSelect={handleSelect}
                className="max-h-[200px] overflow-y-auto"
              />
            </section>
          )}

          {isSearching && (
            <section>
              {loading ? (
                <SearchSkeleton />
              ) : patients.length > 0 ? (
                <>
                  <p className="px-3 pt-0.5 pb-1 text-xs font-medium text-zinc-400">
                    {patients.length} resultado{patients.length !== 1 ? 's' : ''}
                  </p>
                  <PatientList
                    patients={patients}
                    onSelect={handleSelect}
                    className="max-h-[280px] overflow-y-auto"
                  />
                </>
              ) : (
                <div className="px-4 py-4 text-center">
                  <p className="text-sm text-zinc-400">
                    Sin resultados para{' '}
                    <span className="font-medium text-zinc-600">
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

function PatientList({ patients, onSelect, className = '' }) {
  return (
    <ul className={className}>
      {patients.map((patient) => (
        <PatientItem key={patient.id} patient={patient} onSelect={onSelect} />
      ))}
    </ul>
  )
}

function PatientItem({ patient, onSelect }) {
  const { nombre, apellidos, telefono, correo, actualizado_at } = patient
  const fullName = [nombre, apellidos].filter(Boolean).join(' ')
  const contact = telefono ?? correo
  const relativo = formatRelativo(actualizado_at)

  return (
    <li>
      <button
        type="button"
        className="group flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-zinc-50"
        onClick={() => onSelect(patient)}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50">
          <HiOutlineUser size={13} className="text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-800 transition-colors group-hover:text-green-800">
            {fullName}
          </p>
          {contact && <p className="truncate text-xs text-zinc-400">{contact}</p>}
        </div>
        {relativo && (
          <span className="shrink-0 text-xs whitespace-nowrap text-zinc-400">Act. {relativo}</span>
        )}
      </button>
    </li>
  )
}

function SearchSkeleton() {
  return (
    <div className="py-0.5">
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center gap-2.5 px-3 py-2">
          <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-zinc-100" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-28 animate-pulse rounded bg-zinc-100" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
