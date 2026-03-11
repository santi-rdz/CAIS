import { createPortal } from 'react-dom'
import {
  LocalizationProvider,
  MultiSectionDigitalClock,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useController } from 'react-hook-form'
import Input from './Input'
import { HiOutlineClock } from 'react-icons/hi2'
import useDropdownPosition from '@hooks/useDropdownPosition'

const CLOCK_HEIGHT = 224

function formatDigits(digits) {
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}:${digits.slice(2)}`
}

function isValidTime(h, m) {
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

export default function TimePickerComponent({
  name,
  control,
  rules,
  label,
  hasError,
}) {
  const {
    field: { value: time, onChange: setTime },
  } = useController({ name, control, rules, defaultValue: dayjs() })

  const [digits, setDigits] = useState('')
  const { triggerRef, isOpen, positionStyle, toggle, close } =
    useDropdownPosition(CLOCK_HEIGHT, {
      ignoreSelector: '[data-timepicker-clock]',
      dropdownWidth: 240,
    })

  const handleChange = (e) => {
    const newDigits = e.target.value.replace(/\D/g, '').slice(0, 4)
    setDigits(newDigits)

    if (newDigits.length === 0) {
      setTime(null)
      return
    }

    if (newDigits.length === 4) {
      const hours = parseInt(newDigits.slice(0, 2))
      const minutes = parseInt(newDigits.slice(2, 4))
      if (isValidTime(hours, minutes)) {
        setTime(dayjs().hour(hours).minute(minutes).second(0))
        setDigits('')
      } else {
        setTime('invalid')
      }
    }
  }

  const handleBlur = () => {
    if (digits.length > 0) setDigits('')
  }

  const handleClockChange = (newTime) => {
    setTime(newTime)
    setDigits('')
    close()
  }

  const inputValue = digits
    ? formatDigits(digits)
    : time && time !== 'invalid'
      ? dayjs(time).format('hh:mm A')
      : ''

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div ref={triggerRef}>
        <Input
          value={inputValue}
          placeholder={label ?? 'HH:MM (24h)'}
          onChange={handleChange}
          onBlur={handleBlur}
          suffix={
            <HiOutlineClock className="cursor-pointer" onClick={toggle} />
          }
          variant="outline"
          hasError={hasError}
          onClick={toggle}
        />

        {createPortal(
          <div
            data-timepicker-clock
            className={`fixed z-[9999] rounded-xl bg-white shadow-lg transition-opacity ${
              isOpen
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
            style={positionStyle}
            onWheel={(e) => e.stopPropagation()}
          >
            {isOpen && (
              <MultiSectionDigitalClock
                value={time && time !== 'invalid' ? time : null}
                onChange={handleClockChange}
                timeSteps={{ hours: 1, minutes: 1 }}
                ampm
              />
            )}
          </div>,
          document.body
        )}
      </div>
    </LocalizationProvider>
  )
}
