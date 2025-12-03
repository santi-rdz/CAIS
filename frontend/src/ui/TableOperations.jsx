export default function TableOperations({ children, width = 'full' }) {
  return <div className={`flex items-center gap-4 ${width === 'full' ? 'w-full' : 'w-fit'}`}>{children}</div>
}
