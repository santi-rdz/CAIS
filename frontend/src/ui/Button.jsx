import SpinnerMini from './SpinnerMini'

const variants = {
  primary: 'bg-green-800 text-white hover:bg-green-900',
  secondary: 'bg-white border border-green-800 hover:bg-green-100',
  outline: 'bg-white border border-gray-200 hover:border-green-800',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-gray-700 hover:bg-gray-200',
}

const sizes = {
  sm: 'text-6 px-2 py-1 rounded-sm font-semibold',
  md: 'text-5 px-4 py-2.5 rounded-lg font-medium',
  lg: 'text-5 px-6 py-3.5 rounded-lg font-medium',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  isLoading = false,
  icon,
  disabled,
  iconPos = 'left',
  ...props
}) {
  const isButtonDisabled = disabled || isLoading
  const baseStyle = `flex items-center justify-center gap-2 rounded-lg transition-colors duration-300 ${variants[variant] || variants.primary} ${sizes[size]}  ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`
  const iconLeft = iconPos === 'left'
  return (
    <button className={baseStyle} disabled={isButtonDisabled} {...props}>
      {isLoading ? (
        <>
          <SpinnerMini />
          {children}
        </>
      ) : (
        <>
          {iconLeft ? (
            <>
              {icon}
              {children}
            </>
          ) : (
            <>
              {children}
              {icon}
            </>
          )}
        </>
      )}
    </button>
  )
}
