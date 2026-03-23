const COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
}

const MAX_SM_COLS = {
  1: 'max-sm:grid-cols-1',
  2: 'max-sm:grid-cols-2',
  3: 'max-sm:grid-cols-3',
  4: 'max-sm:grid-cols-4',
}

const GAPS = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
}

export default function Grid({
  children,
  cols = 2,
  mobileCols = 1,
  gap = 5,
  className = '',
}) {
  const colClass = COLS[cols] ?? 'grid-cols-2'
  const mobileColClass = MAX_SM_COLS[mobileCols] ?? 'max-sm:grid-cols-1'
  const gapClass = GAPS[gap] ?? 'gap-5'

  return (
    <div
      className={`grid ${colClass} ${mobileColClass} ${gapClass} ${className}`}
    >
      {children}
    </div>
  )
}
