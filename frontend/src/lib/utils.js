import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['1', '2', '3', '4', '5', '6', '7'] }],
    },
  },
})

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const isValidEmail = (email) =>
  /^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(email)

/**
 * Omite recursivamente keys con valor vacío ('', null, undefined).
 * Si un objeto anidado queda sin keys, también se omite.
 */
export function omitEmpty(obj) {
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === '' || v == null) continue
    if (typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
      const cleaned = omitEmpty(v)
      if (Object.keys(cleaned).length) result[k] = cleaned
    } else {
      result[k] = v
    }
  }
  return result
}

/**
 * Formats a 10-digit phone string to (XXX) XXX-XXXX.
 * Strips non-digits first, so it works with raw stored values or partially typed input.
 * @param {string} value - Raw or formatted phone string
 * @returns {string} Formatted phone number
 */
export function formatPhone(value) {
  if (!value) return ''
  const digits = String(value).replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
