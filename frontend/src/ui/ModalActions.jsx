import Row from './Row'

export default function ModalActions({ children, className = '' }) {
  return (
    <div
      className={`sticky right-0 bottom-0 left-0 mt-auto border-t border-t-neutral-200 bg-white px-6 py-4 ${className}`}
    >
      <Row direction="row-end">{children}</Row>
    </div>
  )
}
