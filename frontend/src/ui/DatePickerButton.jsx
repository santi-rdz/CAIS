import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import 'dayjs/locale/es'
import dayjs from 'dayjs'

export default function DatePickerButton({ label, date, setDate, futureDates = false, openTo = 'year' }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DatePicker
        maxDate={futureDates ? undefined : dayjs()}
        views={['year', 'month', 'day']}
        label={label}
        value={date}
        onChange={(newValue) => setDate(newValue)}
        openTo={openTo}
        slotProps={{ popper: { onMouseDown: (e) => e.stopPropagation() } }}
      />
    </LocalizationProvider>
  )
}
