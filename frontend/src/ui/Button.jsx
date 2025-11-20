const variant = {
  primary: "bg-green-800 text-white hover:bg-green-900",
  secondary: "bg-white ring ring-green-800 hover:bg-green-100",
  outline: "bg white ring ring-gray-200 hover:bg-gray-100",
};
const sizes = {
  sm: "text-6 px-2 py-1 rounded-sm font-semibold",
  md: "text-5 px-4 py-2.5 rounded-md font-medium",
  lg: "text-5 px-5 py-3.5 rounded-lg font-medium",
};

export default function Button({ children, type = "primary", size = "lg", className, ...props }) {
  return (
    <button
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg transition-colors duration-300 ${variant[type]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
