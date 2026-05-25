import Button from './Button'
import Row from './Row'

export default function ModalActions({
  onClose,
  primaryAction,
  secondaryAction = {},
  quickSaveAction = null,
  cancelLabel = 'Cancelar',
  className = '',
}) {
  const hasSecondary = Object.keys(secondaryAction).length > 0
  const containerStyle = `shrink-0 border-t border-t-neutral-200 bg-white px-8 py-4 ${className} ${hasSecondary || quickSaveAction ? 'flex items-center justify-between' : ''}`

  if (!hasSecondary && !quickSaveAction) {
    return (
      <div className={containerStyle}>
        <Row direction="row-end">
          <Button type="button" variant="secondary" onClick={onClose} data-testid="modal-cancel-btn">
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            isLoading={primaryAction?.isLoading}
            onClick={primaryAction?.onClick}
            disabled={primaryAction?.disabled}
            type={primaryAction?.type}
            data-testid="modal-primary-btn"
          >
            {primaryAction?.iconPos !== 'right' && primaryAction?.icon}
            {primaryAction?.label || 'Primary Action'}
            {primaryAction?.iconPos === 'right' && primaryAction?.icon}
          </Button>
        </Row>
      </div>
    )
  }

  return (
    <div className={containerStyle}>
      <Button type="button" variant="secondary" onClick={onClose} data-testid="modal-cancel-btn">
        {cancelLabel}
      </Button>
      <Row direction="row-end">
        {secondaryAction && Object.keys(secondaryAction).length > 0 && (
          <Button
            variant="outline"
            isLoading={secondaryAction.isLoading}
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
            className={secondaryAction?.className}
            data-testid="modal-secondary-btn"
          >
            {secondaryAction?.iconPos !== 'right' && secondaryAction?.icon}
            {secondaryAction.label || 'Secondary Action'}
            {secondaryAction?.iconPos === 'right' && secondaryAction?.icon}
          </Button>
        )}
        {quickSaveAction && (
          <Button
            variant="outline"
            isLoading={quickSaveAction.isLoading}
            onClick={quickSaveAction.onClick}
            disabled={quickSaveAction.disabled}
          >
            {quickSaveAction?.icon}
            {quickSaveAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button
            variant="primary"
            isLoading={primaryAction.isLoading}
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            type={primaryAction.type}
            data-testid="modal-primary-btn"
          >
            {primaryAction.iconPos !== 'right' && primaryAction.icon}
            {primaryAction.label || 'Primary Action'}
            {primaryAction.iconPos === 'right' && primaryAction.icon}
          </Button>
        )}
      </Row>
    </div>
  )
}
