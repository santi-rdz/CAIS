export function getFieldError(errors, path) {
  return path.split('.').reduce((current, key) => current?.[key], errors)?.message
}
