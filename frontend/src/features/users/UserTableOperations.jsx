import {
  HiArrowDown,
  HiArrowUp,
  HiMagnifyingGlass,
  HiOutlinePlus,
} from 'react-icons/hi2'
import { USER_SORT_KEYS } from '@cais/shared/constants/users'
import Button from '@ui/Button'
import SortBy from '@ui/SortBy'
import TableOperations from '@ui/TableOperations'
import UserRegisterForms from './UserRegisterForms'
import Filter from '@ui/Filter'
import Input from '@ui/Input'

import { useDebouncedSearch } from '@hooks/useDebouncedSearch'
import Modal from '@ui/Modal'

const SORT_BY_OPTIONS = [
  {
    label: 'Por Nombre',
    options: [
      { label: 'A → Z', value: USER_SORT_KEYS.NOMBRE_ASC, icon: HiArrowUp },
      { label: 'Z → A', value: USER_SORT_KEYS.NOMBRE_DESC, icon: HiArrowDown },
    ],
  },
  {
    label: 'Por Último Login',
    options: [
      {
        label: 'Más reciente',
        value: USER_SORT_KEYS.LOGIN_DESC,
        icon: HiArrowDown,
      },
      {
        label: 'Más antiguo',
        value: USER_SORT_KEYS.LOGIN_ASC,
        icon: HiArrowUp,
      },
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

      <Modal>
        <Modal.Open opens="user-modal">
          <Button size="md">
            <HiOutlinePlus size="16" strokeWidth="2.5" />
            Agregar usuario
          </Button>
        </Modal.Open>
        <Modal.Content
          name="user-modal"
          noPadding
          size="md"
          // className="flex max-h-[95vh] flex-col gap-0 overflow-hidden p-0"
        >
          <UserRegisterForms />
        </Modal.Content>
      </Modal>
    </TableOperations>
  )
}
