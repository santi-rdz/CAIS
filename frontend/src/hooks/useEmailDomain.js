import { useState } from 'react'

const UABC_DOMAIN = '@uabc.edu.mx'

/**
 * Maneja el estado del dominio UABC y resuelve el correo completo al hacer submit.
 * Usado en formularios con DomainEmailInput.
 */
export default function useEmailDomain() {
  const [isUabcDomain, setIsUabcDomain] = useState(true)

  /**
   * Retorna el correo completo. Si es dominio UABC, agrega el sufijo.
   * Limpia el dominio primero por si el usuario lo escribió manualmente.
   */
  function resolveEmail(value = '') {
    if (isUabcDomain) return `${value.replace(UABC_DOMAIN, '')}${UABC_DOMAIN}`
    return value
  }

  return { isUabcDomain, setIsUabcDomain, resolveEmail }
}
