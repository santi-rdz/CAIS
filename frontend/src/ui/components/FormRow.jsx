import { Children } from 'react'

export default function FormRow({ children, label, htmlFor, className, required, error }) {
  const firstChild = Children.toArray(children)[0]
  const childHasError = firstChild?.props?.hasError
  const errorMessage = error ?? (typeof childHasError === 'string' ? childHasError : undefined)

  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-5 mb-2 block">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {errorMessage && (
        <span className="text-5 mt-1.5 inline-block text-red-600">{errorMessage}</span>
      )}
    </div>
  )
}
