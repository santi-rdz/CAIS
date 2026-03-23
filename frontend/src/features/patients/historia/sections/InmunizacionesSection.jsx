import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCalendarDays,
} from 'react-icons/hi2'
import { formatFechaLong } from '@lib/dateHelpers'
import DataField from '../../components/DataField'
import Empty from '../components/Empty'

const VACCINES = [
  { label: 'Influenza', key: 'influenza' },
  { label: 'Tétanos', key: 'tetanos' },
  { label: 'Hepatitis B', key: 'hepatitis_b' },
  { label: 'COVID-19', key: 'covid_19' },
]

export default function InmunizacionesSection({ inm }) {
  if (!inm) return <Empty />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {VACCINES.map(({ label, key }) => {
          const date = inm[key]
          return (
            <div
              key={key}
              className={`flex w-fit flex-1 flex-col gap-2 rounded-xl border p-4 ${
                date
                  ? 'border-green-100 bg-green-50'
                  : 'border-zinc-100 bg-zinc-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-5 font-semibold text-nowrap text-zinc-700">
                  {label}
                </p>
                {date ? (
                  <HiOutlineCheckCircle
                    size={18}
                    className="shrink-0 text-green-500"
                  />
                ) : (
                  <HiOutlineXCircle
                    size={18}
                    className="shrink-0 text-zinc-300"
                  />
                )}
              </div>
              {date ? (
                <div className="flex items-center gap-1.5 text-green-700">
                  <HiOutlineCalendarDays size={12} className="shrink-0" />
                  <p className="text-6 text-nowrap">{formatFechaLong(date)}</p>
                </div>
              ) : (
                <p className="text-6 text-zinc-400">No registrada</p>
              )}
            </div>
          )
        })}
      </div>
      {inm.otros && (
        <DataField
          label="Otras inmunizaciones"
          value={inm.otros}
          multiline
          block
        />
      )}
    </div>
  )
}
