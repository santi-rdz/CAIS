import { HiOutlineClipboardDocumentList, HiOutlineBolt, HiOutlineBeaker } from 'react-icons/hi2'
import Heading from '@ui/components/Heading'

// Campo clínico con jerarquía: el diagnóstico (prominent) lidera; acción y
// tratamiento van como secundarios. Sin cajas anidadas — la jerarquía es
// tipográfica. Los vacíos muestran un mensaje propio en vez de un guion suelto.
function ClinicalField({ icon, label, value, empty, prominent = false }) {
  const has = value != null && String(value).trim() !== ''

  return (
    <div>
      <p className="text-5 flex items-center gap-1.5 font-medium text-zinc-400">
        <span className="text-zinc-400">{icon}</span>
        {label}
      </p>
      <p
        className={`mt-1.5 leading-relaxed whitespace-pre-wrap ${
          has
            ? prominent
              ? 'text-4 font-medium text-zinc-800'
              : 'text-5 text-zinc-700'
            : 'text-5 text-zinc-300'
        }`}
      >
        {has ? value : empty}
      </p>
    </div>
  )
}

export default function MedicalCard({ emergency }) {
  const { diagnostico, accion_realizada, tratamiento_admin } = emergency

  return (
    <section className="shadow-card rounded-2xl border border-gray-100 bg-white p-6">
      <Heading as="h3" showBar>
        Información médica
      </Heading>
      <div className="mt-5 space-y-5">
        <ClinicalField
          icon={<HiOutlineClipboardDocumentList size={14} />}
          label="Diagnóstico"
          value={diagnostico}
          empty="Sin diagnóstico registrado"
          prominent
        />
        <ClinicalField
          icon={<HiOutlineBolt size={14} />}
          label="Acción realizada"
          value={accion_realizada}
          empty="Sin acción registrada"
        />
        {tratamiento_admin && (
          <ClinicalField
            icon={<HiOutlineBeaker size={14} />}
            label="Tratamiento administrado"
            value={tratamiento_admin}
          />
        )}
      </div>
    </section>
  )
}
