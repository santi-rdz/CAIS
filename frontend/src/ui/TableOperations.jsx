export default function TableOperations({ children, width = 'full' }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${width === 'full' ? 'w-full' : 'w-fit'}`}
    >
      {children}
    </div>
  )
}
