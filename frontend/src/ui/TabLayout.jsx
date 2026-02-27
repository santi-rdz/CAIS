import { HiBars3, HiOutlineSquares2X2 } from 'react-icons/hi2'
import Button from './Button'

export default function TabLayout({ layout, setLayout }) {
  return (
    <div className="flex gap-1 rounded-md bg-gray-100 p-1">
      <Button
        variant="ghost"
        size="sm"
        className={layout === 'list' ? 'bg-gray-200' : ''}
        onClick={() => setLayout('list')}
      >
        <HiBars3 size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={layout === 'grid' ? 'bg-gray-200' : ''}
        onClick={() => setLayout('grid')}
      >
        <HiOutlineSquares2X2 size={16} />
      </Button>
    </div>
  )
}
