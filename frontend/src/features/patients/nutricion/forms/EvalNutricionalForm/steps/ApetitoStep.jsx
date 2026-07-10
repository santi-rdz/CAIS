import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import Grid from '@components/Grid'
import MonitoreoSelectField from '@features/patients/nutricion/forms/MonitoreoSelectField'
import ApetitoScoreCard from '@features/patients/nutricion/forms/EvalNutricionalForm/ApetitoScoreCard'
import { APETITO_SCORE_FIELDS, computeApetitoScore } from '@features/patients/nutricion/constants'

export default function ApetitoStep() {
  const { control } = useFormContext()
  const apetito = useWatch({ control, name: 'eval_apetito_nutricion' })

  const { puntaje, clasif } = computeApetitoScore(apetito)

  return (
    <div className="space-y-6">
      <Heading as="h4" showBar>
        Evaluación de Apetito
      </Heading>
      <p className="text-5 -mt-3 text-zinc-500">
        Evaluación con puntuación automática del apetito del paciente.
      </p>

      <Grid cols={2} gap={4} mobileCols={1}>
        {APETITO_SCORE_FIELDS.map(({ name, label, options }) => (
          <MonitoreoSelectField
            key={name}
            name={`eval_apetito_nutricion.${name}`}
            control={control}
            label={label}
            options={options}
          />
        ))}
      </Grid>

      <ApetitoScoreCard puntaje={puntaje} clasif={clasif} />
    </div>
  )
}
