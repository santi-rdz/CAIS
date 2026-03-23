import DataField from '../../components/DataField'
import Empty from '../components/Empty'

export default function PlanEstudioSection({ plan }) {
  if (!plan) return <Empty message="Sin plan de estudio registrado." />

  const { cie10_codes, plan_tratamiento, tratamiento } = plan

  return (
    <div className="space-y-6">
      {/* Diagnósticos CIE-10 */}
      {cie10_codes?.length > 0 && (
        <div className="space-y-2">
          <p className="text-6 font-semibold tracking-widest text-zinc-400 uppercase">
            Diagnóstico CIE-10
          </p>
          <div className="flex flex-wrap gap-2">
            {cie10_codes.map(({ code, description }) => (
              <div
                key={code}
                className="inline-flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5"
              >
                <span className="text-5 shrink-0 font-bold text-blue-700">
                  {code}
                </span>
                {description && (
                  <>
                    <div className="h-4 w-px shrink-0 bg-blue-200" />
                    <span className="text-5 text-blue-600">{description}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan y Tratamiento */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DataField
          label="Plan de tratamiento"
          value={plan_tratamiento}
          multiline
          block
        />
        <DataField label="Tratamiento" value={tratamiento} multiline block />
      </div>
    </div>
  )
}
