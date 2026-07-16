import { useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

// Rellena un campo de diagnóstico con la sugerencia derivada de las mediciones,
// mientras el usuario no lo edite a mano. Al editar un registro existente el
// valor guardado se respeta (no coincide con la última sugerencia). Devuelve un
// marcador que el Select llama al cambiar para "soltar" el auto-relleno.
export function useAutoSuggest(name, suggested) {
  const { setValue, getValues } = useFormContext()
  const lastSuggested = useRef(undefined)
  const overridden = useRef(false)

  useEffect(() => {
    if (overridden.current) return
    const current = getValues(name)
    const isAuto = current === '' || current == null || current === lastSuggested.current
    if (isAuto && suggested !== '' && suggested != null) {
      lastSuggested.current = suggested
      setValue(name, suggested, { shouldDirty: false })
    }
  }, [suggested, name, setValue, getValues])

  return () => {
    overridden.current = true
  }
}
