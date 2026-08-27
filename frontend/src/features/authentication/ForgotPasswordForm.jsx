import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HiArrowLeft, HiOutlineEnvelope } from 'react-icons/hi2'
import DomainEmailInput from '@ui/DomainEmailInput'
import Button from '@components/Button'
import useRequestPasswordReset from '@features/authentication/useRequestPasswordReset'

function BackToLogin() {
  return (
    <Link
      to="/login"
      className="text-6 flex items-center justify-center gap-1.5 font-medium text-blue-600 hover:underline"
    >
      <HiArrowLeft size={16} />
      Volver al inicio de sesión
    </Link>
  )
}

export default function ForgotPasswordForm() {
  const [isUabcDomain, setIsUabcDomain] = useState(true)
  const [sentTo, setSentTo] = useState(null)
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const { requestReset, isPending, isSuccess } = useRequestPasswordReset()

  function onSubmit({ email }) {
    const correo = isUabcDomain ? `${email}@uabc.edu.mx` : email
    requestReset({ correo }, { onSuccess: () => setSentTo(correo) })
  }

  if (isSuccess)
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-green-100 text-green-700">
            <HiOutlineEnvelope size={28} />
          </span>
          <p className="text-4 font-semibold text-neutral-800">Revisa tu correo</p>
          <p className="text-5 text-neutral-500">
            Si <span className="font-medium text-neutral-700">{sentTo}</span> está registrado,
            recibirás un enlace para restablecer tu contraseña.
          </p>
        </div>
        <BackToLogin />
      </div>
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <DomainEmailInput
        id="email"
        register={register}
        error={errors?.email?.message}
        setIsDomain={setIsUabcDomain}
        isDomain={isUabcDomain}
      />

      <Button isLoading={isPending} type="submit" className="w-full">
        Enviar enlace
      </Button>

      <BackToLogin />
    </form>
  )
}
