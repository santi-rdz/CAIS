import { useState } from 'react'
import { isValidEmail } from '@lib/utils'
import DomainToggle from './DomainToggle'
import FormRow from './FormRow'
import Input from './Input'

export default function DomainEmailInput({
  id,
  fieldName = 'email',
  register,
  error,
  onDomainChange,
  extraSuffix = null,
  className,
}) {
  const [isDomain, setIsDomain] = useState(true)

  function handleDomainChange(val) {
    setIsDomain(val)
    onDomainChange?.(val)
  }

  const suffix = (
    <div className="flex items-center gap-2">
      <DomainToggle isDomain={isDomain} setIsDomain={handleDomainChange} />
      {extraSuffix}
    </div>
  )

  return (
    <FormRow htmlFor={id} label={isDomain ? 'Usuario' : 'Correo electrónico'} className={className}>
      <Input
        {...register(fieldName, {
          required: isDomain ? 'Ingresa tu usuario' : 'Ingresa tu correo electrónico',
          validate: (val) => isDomain || isValidEmail(val) || 'Ingresa un correo válido',
        })}
        id={id}
        type="text"
        offset={6}
        placeholder={isDomain ? 'Ej. raul.rodriguez39' : 'Ej raul@ejemplo.com'}
        hasError={error}
        variant="outline"
        suffix={suffix}
      />
    </FormRow>
  )
}
