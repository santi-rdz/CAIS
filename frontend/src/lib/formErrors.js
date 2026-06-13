export function getFieldError(errors, path) {
  if (!errors || typeof path !== 'string' || path.length === 0) return undefined
  return path.split('.').reduce((current, key) => current?.[key], errors)?.message
}
