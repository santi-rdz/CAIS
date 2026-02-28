import { HiMagnifyingGlass, HiOutlinePlus } from 'react-icons/hi2'
import Button from '@ui/Button'
import Modal from '@ui/Modal'
import SortBy from '@ui/SortBy'
import TableOperations from '@ui/TableOperations'
import UserModal from './UserModal'
import Filter from '@ui/Filter'
import Input from '@ui/Input'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

const SORT_BY_OPTIONS = [
  { label: 'Nombre (asc)', value: 'nombre-asc' },
  { label: 'Nombre (desc)', value: 'nombre-desc' },
  { label: 'Login (asc)', value: 'login-asc' },
  { label: 'Login (desc)', value: 'login-desc' },
  { label: 'Limpiar', value: 'clear' },
]

const FILTER_OPTIONS = [
  { value: 'default', label: 'Todos' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'pendiente', label: 'Pendiente' },
]

function useDebouncedSearch(delay = 500) {
  const [params, setParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(params.get('buscar') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchValue.trim()) {
        params.delete('buscar')
        setParams(params)
        return
      }

      params.set('buscar', searchValue)
      params.set('page', 1)
      setParams(params)
    }, delay)

    return () => clearTimeout(timer)
  }, [searchValue, setParams, params, delay])

  return { searchValue, setSearchValue }
}

export default function UserTableOperations() {
  const { searchValue, setSearchValue } = useDebouncedSearch()

  return (
    <TableOperations>
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="mr-auto w-[380px]"
        placeholder="Buscar por nombre o correo..."
        size="sm"
        variant="outline"
        suffix={<HiMagnifyingGlass className="" />}
      />

      <Filter filterField="status" options={FILTER_OPTIONS} />
      <SortBy options={SORT_BY_OPTIONS} />
      
      <Modal>
        <Modal.Open opens="userModal">
          <Button size="md" className="py-2.5">
            <HiOutlinePlus size="16" strokeWidth="2.5" />
            Agregar usuario
          </Button>
        </Modal.Open>
        <Modal.Content name="userModal" noPadding>
          <UserModal />
        </Modal.Content>
      </Modal>
    </TableOperations>
  )
}
