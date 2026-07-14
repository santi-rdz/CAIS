import { Children } from 'react'
import InfoTooltip from '@components/InfoTooltip'

export default function FormRow({
  children,
  label,
  htmlFor,
  className,
  required,
  error,
  hint,
  tooltip,
}) {
  const firstChild = Children.toArray(children)[0]
  const childHasError = firstChild?.props?.hasError
  const errorMessage = error ?? (typeof childHasError === 'string' ? childHasError : undefined)

  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-5 mb-2 block">
        <span className="inline-flex items-center gap-1.5 align-middle">
          <span>
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </span>
          {tooltip && <InfoTooltip text={tooltip} label={`Ayuda: ${label}`} />}
        </span>
        {hint && <span className="text-6 block font-normal text-zinc-400">{hint}</span>}
      </label>
      {children}
      {errorMessage && (
        <span className="text-5 mt-1.5 inline-block text-red-600">{errorMessage}</span>
      )}
    </div>
  )
}
