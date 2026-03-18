import DataField from '../../components/DataField'
import Empty from '../components/Empty'

export default function FieldsSection({ fields }) {
  if (!fields) return <Empty />

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <DataField key={f.label} label={f.label} value={f.value} multiline />
      ))}
    </div>
  )
}
