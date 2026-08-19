import Heading from '@components/Heading'
import DiagnosticoField from '@features/patients/nutricion/forms/EenReportForm/DiagnosticoField'

export default function DiagnosticoStep({ initialEditIndex = null }) {
  return (
    <div className="space-y-4">
      <div>
        <Heading as="h4" showBar>
          Diagnóstico nutricional (PES)
        </Heading>
        <p className="text-5 mt-1 text-zinc-500">
          Registro de diagnósticos PES con intervenciones, objetivos y seguimiento.
        </p>
      </div>

      <DiagnosticoField initialEditIndex={initialEditIndex} />
    </div>
  )
}
