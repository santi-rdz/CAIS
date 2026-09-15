import { useState } from 'react'
import { HiOutlineUser } from 'react-icons/hi2'
import { cn, getInitials } from '@lib/utils'

const SIZES = {
  xs: 'h-8 w-8 text-xs',
  sm: 'h-9 w-9 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-14 w-14 text-sm',
}

// Cascada de fallback: intenta la foto → iniciales (nombre + apellido) → ícono.
export default function UserAvatar({ nombre, apellidos, foto, size = 'md', className }) {
  const [failedFoto, setFailedFoto] = useState(null)
  const initials = getInitials(nombre, apellidos)
  const showImage = Boolean(foto) && foto !== failedFoto

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-medium text-zinc-600 uppercase select-none',
        SIZES[size],
        className
      )}
    >
      {showImage ? (
        <img
          src={foto}
          alt={[nombre, apellidos].filter(Boolean).join(' ')}
          className="size-full object-cover"
          onError={() => setFailedFoto(foto)}
        />
      ) : initials ? (
        initials
      ) : (
        <HiOutlineUser size={18} strokeWidth={1.5} />
      )}
    </div>
  )
}
