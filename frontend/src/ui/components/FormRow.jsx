import { Children } from 'react'

export default function FormRow({
  children,
  label,
  htmlFor,
  className,
  required,
}) {
  const firstChild = Children.toArray(children)[0]
  const hasError = firstChild?.props?.hasError

  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-5 mb-2 block">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hasError && (
        <span className="text-5 mt-1.5 inline-block text-red-600">
          {hasError}
        </span>
      )}
    </div>
  )
}
