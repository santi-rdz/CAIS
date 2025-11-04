export default function Input({ hasError, ...props }) {
  return (
    <input
      className={`bg-black-50 text-4 h-12 w-full rounded-xl px-4 py-3 placeholder:text-[#808080] ${hasError ? "ring ring-red-400" : ""}`}
      {...props}
    />
  );
}
