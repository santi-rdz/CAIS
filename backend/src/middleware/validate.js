import { formatZodErrors } from '#lib/formatErrors.js'
import { parsePositiveIntId } from '#lib/parseId.js'
import { isUUID } from '@cais/shared/schemas/fields'

/**
 * Valida `req.body` con una función safeParse de `@cais/shared/schemas/*`
 * (validateX para create, validatePartialX para update). Si falla responde
 * 422 con el formato de error estándar; si pasa, reemplaza `req.body` con los
 * datos ya parseados y transformados por Zod (fechas coercidas, enums en
 * mayúsculas, strings trimmeados) y cede al controlador.
 *
 * Centraliza el bloque de validación que antes se repetía en cada create/update.
 *
 * @param {(body: object) => { data?: object, error?: import('zod').ZodError }} validateFn
 */
export function validate(validateFn) {
  return (req, res, next) => {
    const result = validateFn(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos inválidos',
        fields: formatZodErrors(result.error),
      })
    }
    req.body = result.data
    next()
  }
}

/**
 * Valida un parámetro de ruta (`req.params[name]`) con un predicado. Responde
 * 422 si no pasa. Se monta con `.all()` sobre `.route('/:id')` para cubrir GET,
 * PATCH y DELETE de un recurso con una sola declaración (antes cada controller
 * repetía la validación de id).
 *
 * @param {string} name - nombre del parámetro (ej. 'id')
 * @param {(value: string) => boolean} isValid - predicado (ej. isUUID)
 * @param {string} message - mensaje de error para el cliente
 */
export function validateParam(name, isValid, message) {
  return (req, res, next) => {
    if (!isValid(req.params[name])) {
      return res.status(422).json({ error: 'ValidationError', message })
    }
    next()
  }
}

/** `validateParam` preconfigurado para ids UUID (BINARY(16) en la DB). */
export const validateUuidParam = (name = 'id') =>
  validateParam(name, isUUID, `El parámetro "${name}" debe ser un UUID válido`)

/**
 * `validateParam` para ids enteros autoincrement. Además de validar, normaliza
 * `req.params[name]` al número parseado para que el controller no dependa de que
 * el modelo haga la conversión.
 */
export const validateIntParam =
  (name = 'id') =>
  (req, res, next) => {
    const parsed = parsePositiveIntId(req.params[name])
    if (parsed === null) {
      return res.status(422).json({
        error: 'ValidationError',
        message: `El parámetro "${name}" debe ser un entero positivo`,
      })
    }
    req.params[name] = parsed
    next()
  }
