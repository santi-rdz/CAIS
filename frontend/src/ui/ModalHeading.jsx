export default function ModalHeading({ children, className = '' }) {
  return <header className={`space-y-1 border-b border-b-neutral-200 p-8 ${className}`}>{children}</header>
}
