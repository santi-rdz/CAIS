import { cn } from '@lib/utils'

// Marca a qué está sujeto un bloque: el rango activo (afectado por el select de
// periodo) vs. "Histórico" (datos que el select no altera).
export default function ScopeBadge({ children, muted = false }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium',
        muted ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-600'
      )}
    >
      {children}
    </span>
  )
}
