import { HiOutlineCheckCircle } from 'react-icons/hi2'
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {VACCINES.map(({ label, key }) => {
          const date = inm[key]
          return (
            <div
              key={key}
              className={`rounded-lg border p-3 ${date ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'}`}
            >
              <p className="text-6 font-medium text-zinc-400">{label}</p>
              {date ? (
                <>
                  <HiOutlineCheckCircle size={14} className="mt-1 text-green-600" />
                  <p className="text-6 mt-0.5 text-zinc-600">{formatFechaLong(date)}</p>
                </>
              ) : (
                <p className="text-6 mt-1 text-zinc-300">No registrada</p>
              )}
            </div>
          )
        })}
      </div>
      {inm.otros && (
        <DataField label="Otras inmunizaciones" value={inm.otros} multiline />
      )}
    </div>
  )
}
