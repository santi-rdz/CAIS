import { createPortal } from 'react-dom'
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es'
import dayjs from 'dayjs'
import Input from './Input'
import { HiCalendar } from 'react-icons/hi2'
import useDropdownPosition from '@hooks/useDropdownPosition'

const CALENDAR_HEIGHT = 340

export default function DatePickerComponent({ date, setDate, label, hasError }) {
  const { triggerRef, isOpen, positionStyle, toggle, close } = useDropdownPosition(CALENDAR_HEIGHT, {
    ignoreSelector: '[data-datepicker-calendar]',
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div ref={triggerRef}>
        <Input
          readOnly
          value={date ? dayjs(date).format('DD/MM/YYYY') : ''}
          placeholder={label ?? 'dd/mm/aaaa'}
          suffix={<HiCalendar className="cursor-pointer" onClick={toggle} />}
          variant="outline"
          hasError={hasError}
          onClick={toggle}
          className="cursor-pointer"
        />

        {isOpen &&
          createPortal(
            <div data-datepicker-calendar className="fixed z-999 rounded-xl bg-white shadow-lg" style={positionStyle}>
              <DateCalendar
                value={date ?? null}
                onChange={(newDate) => {
                  setDate(newDate)
                  close()
                }}
              />
            </div>,
            document.body,
          )}
      </div>
    </LocalizationProvider>
  )
}
