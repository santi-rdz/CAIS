import { HiOutlineEnvelope } from 'react-icons/hi2'

export default function InvitationsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
      <div className="rounded-full border border-gray-200 bg-white p-3 shadow-xs">
        <HiOutlineEnvelope size={20} className="text-gray-400" />
      </div>
      <div className="space-y-0.5">
        <p className="text-4 font-medium text-gray-700">Sin invitaciones aún</p>
        <span className="text-5 text-gray-400">
          Agrega correos para enviar invitaciones de registro.
        </span>
      </div>
    </div>
  )
}
