import { useState } from 'react'
import { z } from 'zod'
import { correoSchema } from '@cais/shared/schemas/fields'

const UABC_DOMAIN = '@uabc.edu.mx'

const usuarioSchema = z.string().min(1, 'Ingresa un usuario').max(255)

/**
 * Maneja el estado del dominio UABC y resuelve el correo completo al hacer submit.
 * Expone `correoField`: campo Zod listo para usar en schemas de formularios.
 * Cuando el dominio está activo acepta solo username; si no, exige email completo.
 */
export default function useEmailDomain() {
  const [isUabcDomain, setIsUabcDomain] = useState(true)

  const correoField = isUabcDomain ? usuarioSchema : correoSchema

  function resolveEmail(value = '') {
    if (isUabcDomain) return `${value.replace(UABC_DOMAIN, '')}${UABC_DOMAIN}`
    return value
  }

  return { isUabcDomain, setIsUabcDomain, resolveEmail, correoField }
}
