import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2'

export default function StatusChip({ active, children, size = 'sm' }) {
  const sizeClasses = size === 'sm' ? 'text-6 px-3 py-1' : 'text-5 px-4 py-2'
  const iconSize = size === 'sm' ? 12 : 14
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${
        active
          ? 'border-green-100 bg-green-50 text-green-700'
          : 'border-zinc-200 bg-zinc-100 text-zinc-400'
      }`}
    >
      {active ? (
        <HiOutlineCheckCircle size={iconSize} />
      ) : (
        <HiOutlineXCircle size={iconSize} />
      )}
      {children}
    </span>
  )
}
