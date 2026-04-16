import Heading from '@components/Heading'
import DataField from '@components/DataField'

export default function MotivoConsultaSection({ motivo_consulta, children }) {
  const hasContent = motivo_consulta || children

  if (!hasContent)
    return (
      <p className="text-5 py-8 text-center text-zinc-400">
        Sin información de consulta registrada.
      </p>
    )

  return (
    <div className="space-y-4">
      <Heading as="h4" showBar>
        Motivo de Consulta
      </Heading>
      <div className="flex flex-col gap-4">
        <DataField
          label="Motivo de consulta"
          value={motivo_consulta}
          multiline
          block
        />
        {children}
      </div>
    </div>
  )
}
