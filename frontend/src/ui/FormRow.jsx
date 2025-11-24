export default function FormRow({ children, label, htmlFor, className }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-5 mb-2 block">
        {label}
      </label>
      {children}
      {children.props.error && <span className="text-5 mt-1.5 inline-block text-red-600">{children.props.error}</span>}
    </div>
  );
}
