import { createPortal } from 'react-dom'
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useController } from 'react-hook-form'
import Input from './Input'
import { HiCalendar } from 'react-icons/hi2'
import useDropdownPosition from '@hooks/useDropdownPosition'

const CALENDAR_HEIGHT = 340
const DEFAULT_MIN = dayjs('1900-01-01')
const DEFAULT_MAX = dayjs('2099-12-31')

// Convierte hasta 8 dígitos en formato visual DD/MM/YYYY
function formatDigits(digits) {
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function isWithinRange(date, minDate, maxDate) {
  return !date.isBefore(minDate, 'day') && !date.isAfter(maxDate, 'day')
}

export default function DatePickerComponent({
  name,
  control,
  rules,
  label,
  hasError,
  birthdate = true,
  minDate = DEFAULT_MIN,
  maxDate = DEFAULT_MAX,
}) {
  const {
    field: { value: date, onChange: setDate },
  } = useController({
    name,
    control,
    rules,
    defaultValue: birthdate ? null : dayjs(),
  })
  const resolvedMax = birthdate ? dayjs() : maxDate
  const [digits, setDigits] = useState('')
  const { triggerRef, isOpen, positionStyle, toggle, close } =
    useDropdownPosition(CALENDAR_HEIGHT, {
      ignoreSelector: '[data-datepicker-calendar]',
      dropdownWidth: 320,
    })

  const handleChange = (e) => {
    const newDigits = e.target.value.replace(/\D/g, '').slice(0, 8)
    setDigits(newDigits)

    if (newDigits.length === 0) {
      setDate(null)
      return
    }

    if (newDigits.length === 8) {
      const day = parseInt(newDigits.slice(0, 2))
      const month = parseInt(newDigits.slice(2, 4))
      const year = parseInt(newDigits.slice(4, 8))
      const parsed = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D', true)
      if (parsed.isValid() && isWithinRange(parsed, minDate, resolvedMax)) {
        setDate(parsed)
        setDigits('')
      } else {
        setDate('invalid')
      }
    }
  }

  const handleBlur = () => {
    // Limpiar si la fecha está incompleta o es inválida
    if (digits.length > 0) setDigits('')
  }

  const handleCalendarChange = (newDate) => {
    setDate(newDate)
    setDigits('')
    close()
  }

  const inputValue = digits
    ? formatDigits(digits)
    : date && date !== 'invalid'
      ? dayjs(date).format('DD/MM/YYYY')
      : ''

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div ref={triggerRef}>
        <Input
          value={inputValue}
          placeholder={label ?? 'DD/MM/AAAA'}
          onChange={handleChange}
          onBlur={handleBlur}
          suffix={<HiCalendar className="cursor-pointer" onClick={toggle} />}
          variant="outline"
          hasError={hasError}
          onClick={toggle}
        />

        {createPortal(
          <div
            data-datepicker-calendar
            className={`fixed z-[9999] rounded-xl bg-white shadow-lg transition-opacity ${
              isOpen
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
            style={positionStyle}
            onWheel={(e) => e.stopPropagation()}
          >
            {isOpen && (
              <DateCalendar
                value={date && date !== 'invalid' ? date : null}
                onChange={handleCalendarChange}
                minDate={minDate}
                maxDate={resolvedMax}
              />
            )}
          </div>,
          document.body
        )}
      </div>
    </LocalizationProvider>
  )
}
