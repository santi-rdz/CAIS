import { useDebouncedSearch } from '@hooks/useDebouncedSearch'
import Filter from '@ui/Filter'
import Input from '@components/Input'
import SortBy from '@ui/SortBy'
import TableOperations from '@ui/TableOperations'
import { PATIENT_SORT_KEYS } from '@cais/shared/constants/patients'
import { HiArrowDown, HiArrowUp } from 'react-icons/hi2'
import NewPatientButton from './components/NewPatientButton'

const SORT_BY_OPTIONS = [
  {
    label: 'Por Nombre',
    options: [
      { label: 'A-Z', value: PATIENT_SORT_KEYS.NOMBRE_ASC, icon: HiArrowUp },
      {
        label: 'Z-A',
        value: PATIENT_SORT_KEYS.NOMBRE_DESC,
        icon: HiArrowDown,
      },
    ],
  },
  {
    label: 'Por Edad',
    options: [
      {
        label: 'Mayor a menor',
        value: PATIENT_SORT_KEYS.NACIMIENTO_ASC,
        icon: HiArrowUp,
      },
      {
        label: 'Menor a mayor',
        value: PATIENT_SORT_KEYS.NACIMIENTO_DESC,
        icon: HiArrowDown,
      },
    ],
  },
  {
    label: 'Por Actualización',
    options: [
      {
        label: 'Más reciente',
        value: PATIENT_SORT_KEYS.ACTUALIZACION_DESC,
        icon: HiArrowDown,
      },
      {
        label: 'Más antiguo',
        value: PATIENT_SORT_KEYS.ACTUALIZACION_ASC,
        icon: HiArrowUp,
      },
    ],
  },
]

const FILTER_GROUPS = [
  {
    label: 'GÉNERO',
    field: 'genero',
    single: true,
    options: [
      { label: 'Masculino', value: 'Masculino' },
      { label: 'Femenino', value: 'Femenino' },
    ],
  },
]

export default function PatientsTableOperations() {
  const { searchValue, setSearchValue } = useDebouncedSearch()
  return (
    <TableOperations>
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        variant="outline"
        placeholder="Buscar pacientes por nombre.."
        size="sm"
        className="mr-auto w-full max-w-[380px]"
      />
      <Filter groups={FILTER_GROUPS} />
      <SortBy options={SORT_BY_OPTIONS} />
      <NewPatientButton variant="secondary" />
    </TableOperations>
  )
}
