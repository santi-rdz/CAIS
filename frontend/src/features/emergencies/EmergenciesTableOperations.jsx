import { useDebouncedSearch } from '@hooks/useDebouncedSearch'
import Button from '@ui/Button'
import Filter from '@ui/Filter'
import Input from '@ui/Input'
import SortBy from '@ui/SortBy'
import TableOperations from '@ui/TableOperations'
import {
  HiArrowDown,
  HiArrowUp,
  HiMagnifyingGlass,
  HiOutlinePlus,
} from 'react-icons/hi2'
import EmergencyForm from './EmergencyForm'
import Modal from '@ui/Modal'

const SORT_BY_OPTIONS = [
  {
    label: 'Por Fecha',
    options: [
      { label: 'Más reciente', value: 'fecha-desc', icon: HiArrowDown },
      { label: 'Más antiguo', value: 'fecha-asc', icon: HiArrowUp },
    ],
  },
  {
    label: 'Por Nombre Paciente',
    options: [
      { label: 'A → Z', value: 'nombre-asc', icon: HiArrowUp },
      { label: 'Z → A', value: 'nombre-desc', icon: HiArrowDown },
    ],
  },
]

const FILTER_GROUPS = [
  {
    label: 'TIPO',
    field: 'recurrente',
    single: true,
    options: [
      { label: 'Recurrente', value: 'true' },
      { label: 'Única vez', value: 'false' },
    ],
  },
]

export default function EmergenciesTableOperations() {
  const { searchValue, setSearchValue } = useDebouncedSearch()

  return (
    <TableOperations>
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="mr-auto w-[380px]"
        placeholder="Buscar por nombre, diagnóstico..."
        size="sm"
        variant="outline"
        suffix={<HiMagnifyingGlass />}
      />

      <Filter groups={FILTER_GROUPS} placeholder="Filtrar" />
      <SortBy options={SORT_BY_OPTIONS} />

      <Modal>
        <Modal.Open opens="emergency">
          <Button size="md">
            <HiOutlinePlus size="16" strokeWidth="2.5" /> Agregar Emergencia
          </Button>
        </Modal.Open>
        <Modal.Content name="emergency" noPadding={true}>
          <EmergencyForm />
        </Modal.Content>
      </Modal>
    </TableOperations>
  )
}
