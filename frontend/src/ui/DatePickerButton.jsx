import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import Button from './Button'
import 'dayjs/locale/es'
import dayjs from 'dayjs'

export default function DatePickerButton({ label, date, setDate, futureDates = false, openTo = 'year' }) {
  return (
    <Button size="md" variant="outline" type="button">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <DatePicker
          maxDate={futureDates ? '' : dayjs()}
          views={['year', 'month', 'day']}
          label={label}
          value={date}
          onChange={(newValue) => setDate(newValue)}
          openTo={openTo}
        />
      </LocalizationProvider>
    </Button>
  )
}
