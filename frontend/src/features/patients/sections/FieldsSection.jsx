import Grid from '@components/Grid'
import DataField from '@components/DataField'
import Empty from './Empty'

export default function FieldsSection({ fields, cols = 2, mobileCols }) {
  if (!fields) return <Empty />

  return (
    <Grid cols={cols} mobileCols={mobileCols}>
      {fields.map((f) => (
        <DataField
          key={f.label}
          label={f.label}
          value={f.value}
          multiline
          block
        />
      ))}
    </Grid>
  )
}
