import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useController } from 'react-hook-form'
import DropdownPanel from '@components/DropdownPanel'
import Input from '@components/Input'
import { HiCalendar } from 'react-icons/hi2'
import useDropdownPosition from '@hooks/useDropdownPosition'

const CALENDAR_HEIGHT = 260
const DEFAULT_MIN = dayjs('1900-01-01')
const DEFAULT_MAX = dayjs('2099-12-31')

// --- Helpers ---

/** Formatea dígitos crudos en DD/MM/YYYY mientras el usuario escribe. */
function formatDigits(digits) {
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

/** Valida que la fecha esté dentro del rango [min, max]. */
function isWithinRange(date, minDate, maxDate) {
  return !date.isBefore(minDate, 'day') && !date.isAfter(maxDate, 'day')
}

/** Intenta parsear 8 dígitos (DDMMYYYY) a un dayjs válido dentro del rango. */
function parseDigits(raw, minDate, maxDate) {
  const day = parseInt(raw.slice(0, 2))
  const month = parseInt(raw.slice(2, 4))
  const year = parseInt(raw.slice(4, 8))
  const parsed = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D', true)

  if (parsed.isValid() && isWithinRange(parsed, minDate, maxDate)) return parsed
  return 'invalid'
}

// --- Componente ---

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
  const [calendarView, setCalendarView] = useState('day')

  const { triggerRef, isOpen, positionStyle, toggle, close } =
    useDropdownPosition(CALENDAR_HEIGHT, {
      ignoreSelector: '[data-datepicker-calendar]',
    })

  // -- Handlers --

  /** Entrada manual: filtra solo dígitos y parsea al completar 8. */
  const handleInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8)
    setDigits(raw)

    if (raw.length === 0) {
      setDate(null)
    } else if (raw.length === 8) {
      setDate(parseDigits(raw, minDate, resolvedMax))
      setDigits('')
    }
  }

  /** Limpia dígitos incompletos al perder foco. */
  const handleBlur = () => {
    if (digits.length > 0) setDigits('')
  }

  /** Selección desde el calendario. Solo cierra al elegir en vista de mes (día final). */
  const handleCalendarChange = (newDate) => {
    setDate(newDate)
    setDigits('')
    if (calendarView === 'month') close()
  }

  // -- Valor del input --

  const inputValue = digits
    ? formatDigits(digits)
    : date && date !== 'invalid'
      ? dayjs(date).format('DD/MM/YYYY')
      : ''

  // -- Render --

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div ref={triggerRef}>
        <Input
          value={inputValue}
          placeholder={label ?? 'DD/MM/AAAA'}
          onChange={handleInputChange}
          onBlur={handleBlur}
          suffix={<HiCalendar className="cursor-pointer" onClick={toggle} />}
          variant="outline"
          hasError={hasError}
          onClick={toggle}
        />

        {/* Calendario flotante */}
        <DropdownPanel
          data-datepicker-calendar
          className={`fixed z-[9999] w-[288px] overflow-hidden transition-opacity ${
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
              onViewChange={setCalendarView}
              views={['year', 'month', 'day']}
              minDate={minDate}
              maxDate={resolvedMax}
              sx={{
                transform: 'scale(0.90)',
                transformOrigin: 'top left',
                marginBottom: '-34px',
              }}
            />
          )}
        </DropdownPanel>
      </div>
    </LocalizationProvider>
  )
}
