import Input from './Input'

export default function InputDatePicker({
  hasError,
  suffix,
  variant = 'fill',
  size = 'lg',
  offset,
  className,
  ...props
}) {
  return <Input {...props} className={className} />
}
