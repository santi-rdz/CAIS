import Heading from './Heading'

export default function ModalHeading({ children, className = '' }) {
  return (
    <header
      className={`space-y-1 border-b border-b-neutral-200 p-8 ${className}`}
    >
      {children}
    </header>
  )
}

export function ModalTitle({ children }) {
  return <Heading as="h2">{children}</Heading>
}

export function ModalDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>
}
