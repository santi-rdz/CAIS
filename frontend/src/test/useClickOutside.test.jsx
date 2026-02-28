import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import useClickOutside from '@hooks/useClickOutside'

// Component that uses useClickOutside
function Box({ onOutside, children }) {
  const ref = useClickOutside(onOutside)
  return (
    <div data-testid="outside">
      <div ref={ref} data-testid="inside">
        {children}
      </div>
    </div>
  )
}

// Simulates a portal element rendered outside the modal ref (like MUI DatePicker Popper)
function Portal({ onMouseDown }) {
  return (
    <div data-testid="portal" onMouseDown={onMouseDown}>
      portal content
    </div>
  )
}

describe('useClickOutside', () => {
  it('calls handler when mousedown is outside the ref', () => {
    const handler = vi.fn()
    const { getByTestId } = render(<Box onOutside={handler} />)

    fireEvent.mouseDown(getByTestId('outside'))

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does NOT call handler when mousedown is inside the ref', () => {
    const handler = vi.fn()
    const { getByTestId } = render(<Box onOutside={handler} />)

    fireEvent.mouseDown(getByTestId('inside'))

    expect(handler).not.toHaveBeenCalled()
  })

  it('does NOT call handler when child stopPropagation is called (MUI Popper scenario)', () => {
    // This test reproduces the DatePicker modal close bug:
    // MUI renders its Popper outside the modal ref via a Portal.
    // Clicking inside the Popper calls stopPropagation on mousedown.
    // The outside-click handler must NOT fire in this case.
    const handler = vi.fn()
    const { getByTestId } = render(
      <>
        <Box onOutside={handler} />
        {/* Portal is outside Box's ref — simulates MUI DatePicker Popper */}
        <Portal onMouseDown={(e) => e.stopPropagation()} />
      </>,
    )

    fireEvent.mouseDown(getByTestId('portal'))

    expect(handler).not.toHaveBeenCalled()
  })
})
