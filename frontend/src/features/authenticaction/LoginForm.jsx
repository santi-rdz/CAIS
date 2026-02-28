import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import Button from '@ui/Button'
import DomainEmailInput from '@ui/DomainEmailInput'
import PasswordInput from '@ui/PasswordInput'
import useLogin from './useLogin'

export default function LoginForm() {
  const [isUabcDomain, setIsUabcDomain] = useState(true)
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const { login, isPending } = useLogin()

  function onSubmit(data) {
    const { email, password } = data
    login({ email: isUabcDomain ? `${email}@uabc.edu.mx` : email, password })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, () => console.log(errors))} role="form">
      <DomainEmailInput
        id="email"
        register={register}
        error={errors?.email?.message}
        onDomainChange={setIsUabcDomain}
        className="mb-6"
      />

      <PasswordInput
        id="password"
        label="Contraseña"
        placeholder="Contraseña"
        error={errors?.password?.message}
        registration={register('password', { required: 'Ingresa tu contraseña' })}
      />

      <Footer />

      <Button isLoading={isPending} className="mt-10 w-full">
        Iniciar Sesion
      </Button>
    </form>
  )
}

function Footer() {
  return (
    <div className="text-6 mt-3 flex justify-between font-medium">
      <span>Recordarme</span>

      <Link to="/forgot-password" className="text-blue-600 hover:underline">
        ¿Olvidaste tu contraseña?
      </Link>
    </div>
  )
}
