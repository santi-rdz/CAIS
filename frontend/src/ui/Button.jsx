const variant = {
  primary: "bg-green-800 text-white",
};
const sizes = {
  sm: "text-6 px-2 py-1 rounded-sm font-semibold",
  md: "text-5 px-4 py-2.5 rounded-md font-medium",
  lg: "text-5 px-5 py-3.5 rounded-lg font-medium",
};

export default function Button({ children, type = "primary", size = "lg", className, ...props }) {
  return (
    <button
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg transition-colors duration-300 hover:bg-green-900 ${variant[type]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
