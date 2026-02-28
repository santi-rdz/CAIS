const directions = {
  row: 'items-center justify-between',
  col: 'flex-col gap-4',
  'row-end': 'grow justify-end gap-2',
  grow: 'flex-1 gap-2',
}

export default function Row({ children, direction = 'row', className = '' }) {
  return <div className={`flex ${directions[direction]} ${className}`}>{children}</div>
}
