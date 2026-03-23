import { createContext, useContext } from 'react'

const TableContext = createContext()

export default function Table({ columns = '', children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div className="text-5 text-dark-gray mt-4 overflow-x-auto rounded-xl border border-zinc-200/60 bg-white shadow-sm">
        <div className="min-w-max">{children}</div>
      </div>
    </TableContext.Provider>
  )
}

Table.Header = function TableHeader({ children }) {
  const { columns } = useContext(TableContext)
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
        <span className="text-5 font-medium text-zinc-400">
          No hay datos que mostrar
        </span>
      </div>
    )
  return (
    <div className="divide-y divide-zinc-100 bg-white font-medium">
      {data.map(render)}
    </div>
  )
}

Table.Row = function TableRow({ children, isCurrentUser, onClick }) {
  const { columns } = useContext(TableContext)

  return (
    <CommonRow
      columns={columns}
      className={`border-l-[3px] border-l-transparent py-3.5 transition-colors duration-150 odd:bg-white even:bg-zinc-50/60 hover:border-l-green-800 hover:bg-green-50/50 ${isCurrentUser ? 'bg-green-50/40' : ''} ${onClick ? 'group relative cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <>{children}</>
    </CommonRow>
  )
}

Table.Footer = function TableFooter({ children }) {
  return (
    <div className="border-t border-zinc-100 bg-zinc-50/50 px-7 py-3">
      {children}
    </div>
  )
}

function CommonRow({ columns, children, className, onClick }) {
  return (
    <div
      className={`grid items-center gap-6 px-7 ${className}`}
      style={{ gridTemplateColumns: columns }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
