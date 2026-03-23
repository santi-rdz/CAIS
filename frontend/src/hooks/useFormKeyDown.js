/**
 * Returns a keydown handler that prevents accidental form submission
 * on Enter (while in an input) and calls the submit function instead.
 *
 * @param {Function} handleSubmit - from react-hook-form
 */
export function useFormKeyDown(handleSubmit) {
  return (submitFn, busy = false) =>
    (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault()
        if (!busy) handleSubmit(submitFn)()
      }
    }
}
