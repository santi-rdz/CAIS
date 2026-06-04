import { createContext, use, useMemo } from 'react'

const TableContext = createContext()

export default function Table({ columns = '', children }) {
  const value = useMemo(() => ({ columns }), [columns])
  return (
    <TableContext.Provider value={value}>
      <div className="text-5 text-dark-gray shadow-card mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <div className="min-w-4xl">{children}</div>
      </div>
    </TableContext.Provider>
  )
}

Table.Header = function TableHeader({ children }) {
  const { columns } = use(TableContext)
  return (
    <div className="border-b border-zinc-100 bg-zinc-50">
      <CommonRow
        className="text-6 py-3 font-semibold tracking-[0.08em] text-zinc-400 uppercase"
        columns={columns}
      >
        {children}
      </CommonRow>
    </div>
  )
}

Table.Body = function TableBody({ data, render }) {
  if (!data?.length)
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 py-14">
        <span className="text-2 text-zinc-200 select-none">—</span>
        <span className="text-5 font-medium text-zinc-400">No hay datos que mostrar</span>
      </div>
    )
  return <div className="divide-y divide-zinc-100 bg-white font-medium">{data.map(render)}</div>
}

Table.Row = function TableRow({ children, isCurrentUser, onClick, ...rest }) {
  const { columns } = use(TableContext)

  return (
    <CommonRow
      columns={columns}
      className={`border-l-[3px] border-l-transparent py-3.5 transition-colors duration-150 odd:bg-white even:bg-zinc-50/60 hover:border-l-green-800 hover:bg-green-50/50 ${isCurrentUser ? 'bg-green-50/40' : ''} ${onClick ? 'group relative cursor-pointer' : ''}`}
      onClick={onClick}
      {...rest}
    >
      <>{children}</>
    </CommonRow>
  )
}

Table.Footer = function TableFooter({ children }) {
  return <div className="border-t border-zinc-100 bg-zinc-50/50 px-7 py-3">{children}</div>
}

function CommonRow({ columns, children, className, onClick, ...rest }) {
  const gridStyle = { gridTemplateColumns: columns }

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={`grid items-center gap-6 px-7 ${className}`}
        style={gridStyle}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(e)
          }
        }}
        {...rest}
      >
        {children}
      </div>
    )
  }

  return (
    <div className={`grid items-center gap-6 px-7 ${className}`} style={gridStyle} {...rest}>
      {children}
    </div>
  )
}
