import { cva } from 'class-variance-authority'
import { cn } from '@lib/utils'
import SpinnerMini from './SpinnerMini'

const buttonVariants = cva(
  'flex items-center text-nowrap justify-center focus-visible:outline-2 focus-visible:outline-green-800 focus-visible:outline-offset-2 gap-2 rounded-lg transition-colors duration-300',
  {
    variants: {
      variant: {
        primary: 'bg-green-800 text-white hover:bg-green-900',
        secondary: 'bg-white ring ring-green-800 hover:bg-green-100',
        outline: 'bg-white ring ring-gray-300 hover:ring-green-800',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'text-gray-700 hover:bg-gray-100',
        'danger-o':
          'ring ring-red-700 text-red-700 hover:bg-red-600 hover:text-white',
      },
      size: {
        sm: 'text-6 px-2 py-1 rounded-sm font-semibold',
        md: 'text-5 px-4 py-2.5 rounded-lg font-medium',
        lg: 'text-5 px-6 py-3.5 rounded-lg font-medium',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
      disabled: false,
    },
  }
)

export default function Button({
  children,
  variant = 'primary',
  size = 'lg',
  className,
  isLoading = false,
  disabled,
  type = 'button',
  ...props
}) {
  const isButtonDisabled = disabled || isLoading
  const baseStyle = cn(
    buttonVariants({ variant, size, disabled: isButtonDisabled }),
    className
  )

  return (
    <button
      type={type}
      className={baseStyle}
      disabled={isButtonDisabled}
      tabIndex={isButtonDisabled ? -1 : 0}
      {...props}
    >
      {isLoading ? (
        <>
          <SpinnerMini />
          {children}
        </>
      ) : (
        <>{children}</>
      )}
    </button>
  )
}
