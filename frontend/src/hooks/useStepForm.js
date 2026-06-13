import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFormSubmit } from '@hooks/useFormSubmit'

/**
 * Maneja la lógica de navegación de un formulario multi-paso.
 * @param {string[]} steps - etiquetas de cada paso
 * @param {string[][]} stepsFields - campos a validar por paso
 * @param {object} defaultValues - valores iniciales del formulario
 * @param {Function} [resolver] - resolver de validación (p.ej. zodResolver)
 * @param {number} [initialStep=0] - paso inicial (para abrir directo en una sección)
 */
export function useStepForm(steps, stepsFields, defaultValues = {}, resolver, initialStep = 0) {
  const [currStep, setCurrStep] = useState(() =>
    Math.max(0, Math.min(initialStep, steps.length - 1))
  )
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
    const stepsToValidate = stepsFields.slice(currStep, i)
    const results = await Promise.all(stepsToValidate.map((fields) => trigger(fields)))
    if (results.some((valid) => !valid)) return
    setCurrStep(i)
  }

  const baseSubmit = useFormSubmit(handleSubmit)
  function getFormSubmit(submitFn, busy = false) {
    if (isLast) return baseSubmit(submitFn, busy)
    return (e) => {
      e.preventDefault()
      if (!busy) handleNext()
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
    getFormSubmit,
  }
}
