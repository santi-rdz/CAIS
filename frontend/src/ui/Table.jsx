import { createContext, useContext } from "react";

const TableContext = createContext();

export default function Table({ columns = "", children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div className="text-5 text-dark-gray mt-4 divide-y divide-gray-300 overflow-hidden rounded-xl border border-gray-300">
        {children}
      </div>
    </TableContext.Provider>
  );
}

Table.Header = function TableHeader({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <div className="grid gap-6 bg-gray-50 px-7 py-4 font-semibold uppercase" style={{ gridTemplateColumns: columns }}>
      {children}
    </div>
  );
};

Table.Body = function TableBody({ data, render }) {
  if (!data?.length) return <div className="px-7 py-4">No hay datos que mostrar</div>;
  return <div className="divide-y divide-neutral-200 bg-white px-7 font-medium">{data.map(render)}</div>;
};

Table.Row = function TableRow({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <div className="grid items-center gap-6 py-3" style={{ gridTemplateColumns: columns }}>
      {children}
    </div>
  );
};

Table.Footer = function TableFooter({ children }) {
  return <div className="bg-gray-50 p-4">{children}</div>;
};
