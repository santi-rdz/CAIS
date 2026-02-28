import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'
import FormRow from './FormRow'
import Input from './Input'

function ToggleShowPassword({ show, setShow, className, style }) {
  return (
    <button
      style={style}
      type="button"
      onClick={() => setShow((p) => !p)}
      className={`cursor-pointer text-neutral-500 active:scale-105 ${className}`}
      data-testid="toggle-password"
    >
      {show ? (
        <HiOutlineEye size={20} />
      ) : (
        <HiOutlineEyeSlash size={20} className="transition-transform duration-300 hover:scale-105" />
      )}
    </button>
  )
}

export default function PasswordInput({ id, label, placeholder, error, registration, variant }) {
  const [show, setShow] = useState(false)
  return (
    <FormRow htmlFor={id} label={label}>
      <Input
        {...registration}
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        hasError={error}
        variant={variant}
        suffix={<ToggleShowPassword show={show} setShow={setShow} />}
      />
    </FormRow>
  )
}
