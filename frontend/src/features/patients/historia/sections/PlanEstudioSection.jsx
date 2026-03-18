import DataField from '../../components/DataField'
import Empty from '../components/Empty'

export default function PlanEstudioSection({ plan }) {
  if (!plan) return <Empty message="Sin plan de estudio registrado." />

  return (
    <div className="space-y-5">
      <div>
        <span className="text-6 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-medium text-blue-700">
          CIE-10: {plan.codigo_cie10}
        </span>
      </div>
      <DataField label="Plan de tratamiento" value={plan.plan_tratamiento} multiline />
      <DataField label="Tratamiento" value={plan.tratamiento} multiline />
    </div>
  )
}
