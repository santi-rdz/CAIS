import { useState } from 'react'
import { useForm } from 'react-hook-form'

/**
 * Maneja la lógica de navegación de un formulario multi-paso.
 * @param {string[]} steps - etiquetas de cada paso
 * @param {string[][]} stepsFields - campos a validar por paso
 * @param {object} defaultValues - valores iniciales del formulario
 * @param {Function} [resolver] - resolver de validación (p.ej. zodResolver)
 */
export function useStepForm(steps, stepsFields, defaultValues = {}, resolver) {
  const [currStep, setCurrStep] = useState(0)
  const methods = useForm({
    mode: 'onChange',
    defaultValues,
    ...(resolver ? { resolver } : {}),
  })
  const { trigger, handleSubmit } = methods
  const isLast = currStep === steps.length - 1

  async function handleNext() {
    const valid = await trigger(stepsFields[currStep])
    if (valid) setCurrStep((p) => p + 1)
  }

  async function handleStepClick(i) {
    if (i <= currStep) {
      setCurrStep(i)
      return
    }
    for (let step = currStep; step < i; step++) {
      const valid = await trigger(stepsFields[step])
      if (!valid) return
    }
    setCurrStep(i)
  }

  function getFormKeyDown(submitFn) {
    return (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault()
        if (isLast) handleSubmit(submitFn)()
        else handleNext()
      }
    }
  }

  return {
    currStep,
    setCurrStep,
    handleNext,
    handleStepClick,
    isLast,
    methods,
    handleSubmit,
    getFormKeyDown,
  }
}
