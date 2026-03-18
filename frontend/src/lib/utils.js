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
