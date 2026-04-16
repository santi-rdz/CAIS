import { useState, useRef, useEffect } from 'react'
import { z } from 'zod'
import { correoSchema } from '@cais/shared/schemas/fields'

const UABC_DOMAIN = '@uabc.edu.mx'

/**
 * Maneja el estado del dominio UABC y resuelve el correo completo al hacer submit.
 * Expone `correoField`: campo Zod listo para usar en schemas de formularios.
 * Cuando el dominio está activo acepta solo username; si no, exige email completo.
 */
export default function useEmailDomain() {
  const [isUabcDomain, setIsUabcDomain] = useState(true)

  const isUabcDomainRef = useRef(isUabcDomain)
  useEffect(() => {
    isUabcDomainRef.current = isUabcDomain
  }, [isUabcDomain])

  const correoField = useRef(
    z
      .string()
      .min(1, 'Ingresa un usuario')
      .max(255)
      .refine(
        (val) => isUabcDomainRef.current || correoSchema.safeParse(val).success,
        'Correo electrónico inválido'
      )
  ).current

  function resolveEmail(value = '') {
    if (isUabcDomain) return `${value.replace(UABC_DOMAIN, '')}${UABC_DOMAIN}`
    return value
  }

  return { isUabcDomain, setIsUabcDomain, resolveEmail, correoField }
}
