const variant = {
  primary: "bg-green-800 text-white",
};

export default function Button({
  children,
  type = "primary",
  className,
  ...props
}) {
  return (
    <button
      className={`text-4 font-bold py-3 hover:bg-green-900 cursor-pointer transition-colors duration-300 px-6 rounded-lg w-full ${variant[type]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
