import { cloneElement } from 'react'
import { cn } from './lib/utils'
import { cva } from 'class-variance-authority'

const inputVariants = cva(
  'text-4 w-full duration-100 placeholder:text-[#808080]',
  {
    variants: {
      size: {
        sm: 'text-5 px-3.5 py-2 rounded-lg',
        md: 'text-5 px-4 py-2.5 rounded-lg',
        lg: 'text-5 px-4 py-3.5 rounded-xl',
        xl: 'text-5 py-3',
      },
      variant: {
        outline: 'border bg-white shadow-xs border-gray-200 ',
        fill: 'bg-black-50 ',
        'outline-b':
          'border-b border-b-gray-200  outline-none focus:border-b-green-800 pb-4',
      },
    },
  }
)

export default function Input({
  hasError,
  suffix,
  variant = 'fill',
  size = 'lg',
  offset,
  className,
  textarea = false,
  ...props
}) {
  const fieldClass = cn(
    inputVariants({ size, variant }),
    hasError
      ? 'error'
      : 'focus-visible:outline-[1.5px] focus-visible:outline-green-900'
  )

  return (
    <div className={`relative ${className}`}>
      {textarea ? (
        <textarea className={fieldClass} {...props} />
      ) : (
        <input className={fieldClass} {...props} />
      )}

      {!textarea &&
        suffix &&
        cloneElement(suffix, {
          style: { right: `${offset ?? 12}px` },
          className: `absolute top-1/2 -translate-y-1/2 flex gap-2`,
        })}
    </div>
  )
}
