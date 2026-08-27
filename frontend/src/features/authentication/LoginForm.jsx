import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import DomainEmailInput from '@ui/DomainEmailInput'
import PasswordInput from '@components/PasswordInput'
import useLogin from '@features/authentication/useLogin'
import Button from '@components/Button'

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
    <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
      <DomainEmailInput
        id="email"
        register={register}
        error={errors?.email?.message}
        setIsDomain={setIsUabcDomain}
        isDomain={isUabcDomain}
        className="mb-6"
      />

      <PasswordInput
        id="password"
        label="Contraseña"
        placeholder="Contraseña"
        error={errors?.password?.message}
        registration={register('password', {
          required: 'Ingresa tu contraseña',
        })}
      />

      <Footer />

      <Button
        isLoading={isPending}
        type="submit"
        className="mt-10 w-full"
        data-testid="login-submit"
      >
        Iniciar Sesión
      </Button>
    </form>
  )
}

function Footer() {
  return (
    <div className="text-6 mt-3 flex justify-end font-medium">
      <Link to="/recuperar-contrasena" className="text-blue-600 hover:underline">
        ¿Olvidaste tu contraseña?
      </Link>
    </div>
  )
}
