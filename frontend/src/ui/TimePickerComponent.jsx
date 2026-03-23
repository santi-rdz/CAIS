import {
  LocalizationProvider,
  MultiSectionDigitalClock,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useController } from 'react-hook-form'
import DropdownPanel from '@components/DropdownPanel'
import Input from '@components/Input'
import { HiOutlineClock } from 'react-icons/hi2'
import useDropdownPosition from '@hooks/useDropdownPosition'

const CLOCK_HEIGHT = 224

// --- Helpers ---

/** Formatea dígitos crudos en HH:MM mientras el usuario escribe. */
function formatDigits(digits) {
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}:${digits.slice(2)}`
}

/** Valida hora (0-23) y minutos (0-59). */
function isValidTime(h, m) {
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

/** Intenta parsear 4 dígitos (HHMM) a un dayjs válido con esa hora. */
function parseDigits(raw) {
  const hours = parseInt(raw.slice(0, 2))
  const minutes = parseInt(raw.slice(2, 4))

  if (isValidTime(hours, minutes)) {
    return dayjs().hour(hours).minute(minutes).second(0)
  }
  return 'invalid'
}

// --- Componente ---

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

  // -- Handlers --

  /** Entrada manual: filtra solo dígitos y parsea al completar 4. */
  const handleInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    setDigits(raw)

    if (raw.length === 0) {
      setTime(null)
    } else if (raw.length === 4) {
      setTime(parseDigits(raw))
      setDigits('')
    }
  }

  /** Limpia dígitos incompletos al perder foco. */
  const handleBlur = () => {
    if (digits.length > 0) setDigits('')
  }

  /** Selección desde el reloj. */
  const handleClockChange = (newTime) => {
    setTime(newTime)
    setDigits('')
  }

  /** Cierra solo al hacer clic en minutos (última sección del reloj 24h). */
  const handleClockClick = (e) => {
    const item = e.target.closest('.MuiMultiSectionDigitalClockSection-item')
    if (!item) return
    const section = item.closest('.MuiMultiSectionDigitalClockSection-root')
    if (!section) return
    const sections = section.parentElement.querySelectorAll(
      '.MuiMultiSectionDigitalClockSection-root'
    )
    if (section === sections[sections.length - 1]) close()
  }

  // -- Valor del input --

  const inputValue = digits
    ? formatDigits(digits)
    : time && time !== 'invalid'
      ? dayjs(time).format('HH:mm')
      : ''

  // -- Render --

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div ref={triggerRef}>
        <Input
          value={inputValue}
          placeholder={label ?? 'HH:MM'}
          onChange={handleInputChange}
          onBlur={handleBlur}
          suffix={
            <HiOutlineClock className="cursor-pointer" onClick={toggle} />
          }
          variant="outline"
          hasError={hasError}
          onClick={toggle}
        />

        {/* Reloj flotante */}
        <DropdownPanel
          data-timepicker-clock
          className={`fixed z-[9999] transition-opacity ${
            isOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
          style={positionStyle}
          onWheel={(e) => e.stopPropagation()}
        >
          {isOpen && (
            <div onClick={handleClockClick}>
              <MultiSectionDigitalClock
                value={time && time !== 'invalid' ? time : null}
                onChange={handleClockChange}
                timeSteps={{ hours: 1, minutes: 1 }}
                ampm={false}
              />
            </div>
          )}
        </DropdownPanel>
      </div>
    </LocalizationProvider>
  )
}
