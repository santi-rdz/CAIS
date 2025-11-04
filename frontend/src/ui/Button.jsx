const variant = {
  primary: "bg-green-800 text-white",
};

export default function Button({ children, type = "primary", className, ...props }) {
  return (
    <button
      className={`text-4 w-full cursor-pointer rounded-lg px-6 py-3 font-bold transition-colors duration-300 hover:bg-green-900 ${variant[type]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
