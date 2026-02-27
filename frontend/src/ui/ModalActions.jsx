import Row from './Row'

export default function ModalActions({ children, className = '' }) {
  return (
    <div className={`sticky right-0 bottom-0 left-0 mt-auto border-t border-t-neutral-200 bg-white p-6 ${className}`}>
      <Row direction="row-end">{children}</Row>
    </div>
  )
}
