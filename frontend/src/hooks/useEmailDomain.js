import { useState } from 'react'
import { z } from 'zod'
import { correoSchema } from '@cais/shared/schemas/fields'

const UABC_DOMAIN = '@uabc.edu.mx'

const usuarioSchema = z.string().min(1, 'Ingresa un usuario').max(255)

const emailSchema = z
  .string()
  .min(1, 'Ingresa tu correo')
  .max(255)
  .refine(
    (val) => correoSchema.safeParse(val).success,
    'Correo electrónico inválido'
  )

/**
 * Maneja el estado del dominio UABC y resuelve el correo completo al hacer submit.
 * Expone `correoField`: campo Zod listo para usar en schemas de formularios.
 * Cuando el dominio está activo acepta solo username; si no, exige email completo.
 */
export default function useEmailDomain() {
  const [isUabcDomain, setIsUabcDomain] = useState(true)

  const correoField = isUabcDomain ? usuarioSchema : emailSchema

  function resolveEmail(value = '') {
    if (isUabcDomain) return `${value.replace(UABC_DOMAIN, '')}${UABC_DOMAIN}`
    return value
  }

  return { isUabcDomain, setIsUabcDomain, resolveEmail, correoField }
}
