import DataField from '@ui/components/DataField'
import Heading from '@ui/components/Heading'

export default function MedicalCard({ emergency }) {
  const { diagnostico, accion_realizada, tratamiento_admin } = emergency
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Heading as="h3" showBar>
        Información médica
      </Heading>
      <div className="mt-5 space-y-5">
        <DataField label="Diagnóstico" value={diagnostico} multiline />
        <DataField
          label="Acción realizada"
          value={accion_realizada}
          multiline
        />
        {tratamiento_admin && (
          <DataField
            label="Tratamiento administrativo"
            value={tratamiento_admin}
            multiline
          />
        )}
      </div>
    </section>
  )
}
