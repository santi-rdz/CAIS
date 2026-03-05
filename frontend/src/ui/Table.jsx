import { createContext, useContext } from 'react'

const TableContext = createContext()

export default function Table({ columns = '', children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div className="text-5 text-dark-gray mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_1px_16px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.02)]">
        {children}
      </div>
    </TableContext.Provider>
  )
}

Table.Header = function TableHeader({ children }) {
  const { columns } = useContext(TableContext)
  return (
    <div className="border-b border-gray-100 bg-gray-50/80">
      <CommonRow
        className="text-6 py-3 font-semibold tracking-[0.08em] text-gray-400 uppercase"
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
        <span className="text-2 text-gray-200 select-none">—</span>
        <span className="text-5 font-medium text-gray-400">
          No hay datos que mostrar
        </span>
      </div>
    )
  return (
    <div className="divide-y divide-gray-50 bg-white font-medium">
      {data.map(render)}
    </div>
  )
}

Table.Row = function TableRow({ children }) {
  const { columns } = useContext(TableContext)
  return (
    <CommonRow
      columns={columns}
      className="border-l-[3px] border-l-transparent py-3 transition-colors duration-150 hover:border-l-green-500 hover:bg-green-50/50"
    >
      <>{children}</>
    </CommonRow>
  )
}

Table.Footer = function TableFooter({ children }) {
  return (
    <div className="border-t border-gray-100 bg-gray-50/50 px-7 py-3">
      {children}
    </div>
  )
}

function CommonRow({ columns, children, className }) {
  return (
    <div
      className={`grid items-center gap-6 px-7 ${className}`}
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </div>
  )
}
