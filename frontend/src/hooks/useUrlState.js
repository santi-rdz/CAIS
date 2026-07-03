import { useSearchParams } from 'react-router-dom'

/**
 * Estado tipo useState respaldado por un query param de la URL — reemplaza los
 * patrones ad-hoc de useSearchParams + set/delete manual repetidos por la app
 * (selección de historia, nota, tab activo...). Siempre navega con
 * `{ replace: true }` para no ensuciar el historial del navegador.
 *
 * @param {string} [key] - nombre del query param. Si es falsy, se comporta
 *   como estado no persistido (útil para deshabilitar el sync condicionalmente
 *   sin romper las reglas de hooks en el llamador).
 * @param {*} [defaultValue] - valor cuando el param no está presente en la URL
 *   (o cuando `key` es falsy). Asignar este valor con `setValue` borra el param.
 */
export function useUrlState(key, defaultValue = null) {
  const [searchParams, setSearchParams] = useSearchParams()

  if (!key) return [defaultValue, () => {}]

  const raw = searchParams.get(key)
  // searchParams.get siempre devuelve string|null — si defaultValue es numérico,
  // castea para que el tipo de `value` sea consistente esté o no en la URL.
  const value = raw === null ? defaultValue : typeof defaultValue === 'number' ? Number(raw) : raw

  function setValue(next) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        if (next == null || next === defaultValue) {
          params.delete(key)
        } else {
          params.set(key, next)
        }
        return params
      },
      { replace: true }
    )
  }

  return [value, setValue]
}
