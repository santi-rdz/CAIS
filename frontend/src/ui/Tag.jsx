const variant = {
  activo: 'bg-green-200 text-green-700 capitalize',
  inactivo: 'bg-red-100 text-red-500 capitalize',
  pendiente: 'bg-blue-100 text-blue-600 capitalize ',
  white: 'bg-white shadow-sm',
  outline: 'bg-white ring ring-gray-300 text-green-800 font-medium',
}

const sizes = {
  xs: 'text-7 px-2 py-1',
  sm: 'text-6 px-3 py-1',
  md: 'text-5 px-3 py-2',
}

const radius = {
  full: 'rounded-full',
  sm: 'rounded-sm',
  md: 'rounded-md',
}

export default function Tag({ children, type, size = 'sm', rounded = 'full' }) {
  return <span className={`tracking-wide ${variant[type]} ${radius[rounded]} ${sizes[size]} `}>{children}</span>
}
