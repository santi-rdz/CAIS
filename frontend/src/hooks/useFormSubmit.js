/**
 * Returns a form onSubmit factory bound to RHF's handleSubmit.
 * @param {Function} handleSubmit - from react-hook-form
 */
export function useFormSubmit(handleSubmit) {
  return (submitFn, busy = false) =>
    (e) => {
      e.preventDefault()
      if (!busy) handleSubmit(submitFn)()
    }
}
