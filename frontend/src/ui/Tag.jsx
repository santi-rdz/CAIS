const statusStyles = {
  activo: "bg-green-200 text-green-700 capitalize",
  inactivo: "bg-red-100 text-red-500 capitalize",
  "registro enviado": "bg-blue-100 text-blue-600 capitalize ",
  white: "bg-white shadow-sm",
};

const sizes = {
  sm: "text-6 px-3 py-1",
  md: "text-5 px-3 py-2",
};

export default function Tag({ children, type, size = "sm" }) {
  return <span className={`rounded-full px-3 py-1 ${statusStyles[type]} ${sizes[size]} `}>{children}</span>;
}
