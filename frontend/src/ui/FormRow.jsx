export default function FormRow({ children, label, error, htmlFor, className }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-5 mb-2 block">
        {label}
      </label>
      {children}
      {error && <span className="text-5 mt-1.5 inline-block text-red-600">{error}</span>}
    </div>
  );
}
