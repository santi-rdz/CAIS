import {
  HiArrowDown,
  HiArrowUp,
  HiMagnifyingGlass,
  HiOutlinePlus,
} from 'react-icons/hi2'
import Button from '@ui/Button'
import SortBy from '@ui/SortBy'
import TableOperations from '@ui/TableOperations'
import UserModal from './UserModal'
import Filter from '@ui/Filter'
import Input from '@ui/Input'
import { Dialog, DialogContent, DialogTrigger } from '@ui/components/ui/dialog'
import { useDebouncedSearch } from '@hooks/useDebouncedSearch'
import { useState } from 'react'

const SORT_BY_OPTIONS = [
  {
    label: 'Por Nombre',
    options: [
      { label: 'A → Z', value: 'nombre-asc', icon: HiArrowUp },
      { label: 'Z → A', value: 'nombre-desc', icon: HiArrowDown },
    ],
  },
  {
    label: 'Por Último Login',
    options: [
      { label: 'Más reciente', value: 'login-desc', icon: HiArrowDown },
      { label: 'Más antiguo', value: 'login-asc', icon: HiArrowUp },
    ],
  },
]

const FILTER_GROUPS = [
  {
    label: 'ROL',
    field: 'rol',
    options: [
      { label: 'Pasante', value: 'pasante' },
      { label: 'Coordinador', value: 'coordinador' },
    ],
  },
  {
    label: 'ESTADO',
    field: 'status',
    options: [
      { label: 'Activo', value: 'activo' },
      { label: 'Inactivo', value: 'inactivo' },
      { label: 'Pendiente', value: 'pendiente' },
    ],
  },
]

export default function UserTableOperations() {
  const { searchValue, setSearchValue } = useDebouncedSearch()
  const [open, setOpen] = useState(false)

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

      <Filter groups={FILTER_GROUPS} placeholder="Filtrar" />
      <SortBy options={SORT_BY_OPTIONS} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="md" className="py-2.5">
            <HiOutlinePlus size="16" strokeWidth="2.5" />
            Agregar usuario
          </Button>
        </DialogTrigger>
        <DialogContent className="flex max-h-[95vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <UserModal onCloseModal={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </TableOperations>
  )
}
