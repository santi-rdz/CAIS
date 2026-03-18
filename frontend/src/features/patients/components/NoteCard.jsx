import { HiOutlineClipboardDocument } from 'react-icons/hi2'
import Heading from '@components/Heading'
import DataField from './DataField'

export default function NoteCard({ note }) {
  const { motivo_consulta, ant_gine_andro } = note

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-green-700">
          <HiOutlineClipboardDocument size={14} />
        </div>
        <Heading as="h4">Nota de evolución</Heading>
      </div>
      <div className="mt-4 space-y-4">
        {motivo_consulta && (
          <DataField
            label="Motivo de consulta"
            value={motivo_consulta}
            multiline
          />
        )}
        {ant_gine_andro && (
          <DataField
            label="Antecedentes gin./androl."
            value={ant_gine_andro}
            multiline
          />
        )}
        {!motivo_consulta && !ant_gine_andro && (
          <p className="text-5 text-zinc-400">Sin contenido registrado.</p>
        )}
      </div>
    </div>
  )
}
