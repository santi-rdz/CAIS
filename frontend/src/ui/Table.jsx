import { createContext, useContext } from "react";

const TableContext = createContext();

export default function Table({ columns = "", children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div className="text-5 text-dark-gray mt-4 divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
        {children}
      </div>
    </TableContext.Provider>
  );
}

Table.Header = function TableHeader({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <CommonRow className="py-4 font-semibold tracking-wide uppercase" columns={columns}>
      {children}
    </CommonRow>
  );
};

Table.Body = function TableBody({ data, render }) {
  if (!data?.length) return <div className="px-7 py-4">No hay datos que mostrar</div>;
  return <div className="divide-y divide-gray-100 bg-white font-medium">{data.map(render)}</div>;
};

Table.Row = function TableRow({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <CommonRow columns={columns} className="py-3">
      <>{children}</>
    </CommonRow>
  );
};

Table.Footer = function TableFooter({ children }) {
  return <div className="bg-gray-50 p-4">{children}</div>;
};

function CommonRow({ columns, children, className }) {
  return (
    <div className={`grid items-center gap-6 px-7 ${className}`} style={{ gridTemplateColumns: columns }}>
      {children}
    </div>
  );
}
