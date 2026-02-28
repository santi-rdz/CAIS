import Button from './Button'
import Row from './Row'

export default function ModalActions({
  onClose,
  primaryAction,
  secondaryAction = {},
  cancelLabel = 'Cancelar',
  className = '',
}) {
  const hasSecondary = Object.keys(secondaryAction).length > 0
  const containerStyle = `shrink-0 border-t border-t-neutral-200 bg-white px-8 py-4 ${className} ${hasSecondary ? 'flex items-center justify-between' : ''}`

  if (!hasSecondary) {
    return (
      <div className={containerStyle}>
        <Row direction="row-end">
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            isLoading={primaryAction?.isLoading}
            icon={primaryAction?.icon}
            iconPos={primaryAction?.iconPos}
            onClick={primaryAction?.onClick}
            disabled={primaryAction?.disabled}
          >
            {primaryAction?.label || 'Primary Action'}
          </Button>
        </Row>
      </div>
    )
  }

  return (
    <div className={containerStyle}>
      <Button variant="secondary" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Row direction="row-end">
        {secondaryAction && (
          <Button
            variant="outline"
            isLoading={secondaryAction.isLoading}
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
            icon={secondaryAction?.icon}
            iconPos={secondaryAction?.iconPos}
            className={secondaryAction?.className}
          >
            {secondaryAction.label || 'Secondary Action'}
          </Button>
        )}
        {primaryAction && (
          <Button variant="primary" {...primaryAction}>
            {primaryAction.label || 'Primary Action'}
          </Button>
        )}
      </Row>
    </div>
  )
}
