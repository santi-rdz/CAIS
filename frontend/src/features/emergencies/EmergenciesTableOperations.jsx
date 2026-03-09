import { useDebouncedSearch } from '@hooks/useDebouncedSearch'
import Input from '@ui/Input'
import TableOperations from '@ui/TableOperations'
import { HiMagnifyingGlass } from 'react-icons/hi2'

export default function EmergenciesTableOperations() {
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
    </TableOperations>
  )
}
