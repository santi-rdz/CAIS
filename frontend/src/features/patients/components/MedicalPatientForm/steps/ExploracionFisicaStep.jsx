import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import Divider from '@components/Divider'

export default function ExploracionFisicaStep() {
  const { register } = useFormContext()

  return (
    <div className="space-y-5">
      <Heading as="h3" showBar>
        Exploración Física y Somatometría
      </Heading>

      {/* ── Somatometría ── */}
      <div className="space-y-4">
        <p className="text-5 font-medium text-zinc-700">Somatometría</p>

        <Grid cols={4} gap={4} mobileCols={2}>
          <FormRow htmlFor="peso" label="Peso / kg">
            <Input
              {...register('peso')}
              id="peso"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="altura" label="Altura / cm">
            <Input
              {...register('altura')}
              id="altura"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="pa_sistolica" label="T/A Sistólica">
            <Input
              {...register('pa_sistolica')}
              id="pa_sistolica"
              type="number"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="pa_diastolica" label="T/A Diastólica">
            <Input
              {...register('pa_diastolica')}
              id="pa_diastolica"
              type="number"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
        </Grid>

        <Grid cols={4} gap={4} mobileCols={2}>
          <FormRow htmlFor="fc" label="FC (lpm)">
            <Input
              {...register('fc')}
              id="fc"
              type="number"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="fr" label="FR (rpm)">
            <Input
              {...register('fr')}
              id="fr"
              type="number"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="circ_cintura" label="Circ. Cintura (cm)">
            <Input
              {...register('circ_cintura')}
              id="circ_cintura"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="circ_cadera" label="Circ. Cadera (cm)">
            <Input
              {...register('circ_cadera')}
              id="circ_cadera"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
        </Grid>

        <Grid cols={4} gap={4} mobileCols={2}>
          <FormRow htmlFor="sp_o2" label="SpO₂ (%)">
            <Input
              {...register('sp_o2')}
              id="sp_o2"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="glucosa_capilar" label="Glucosa Capilar (mg/dL)">
            <Input
              {...register('glucosa_capilar')}
              id="glucosa_capilar"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="temperatura" label="Temperatura (°C)">
            <Input
              {...register('temperatura')}
              id="temperatura"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
        </Grid>
      </div>

      <Divider />

      <Grid cols={2} gap={4} mobileCols={1}>
        <FormRow htmlFor="habito_exterior" label="Hábito Exterior">
          <Input
            {...register('habito_exterior')}
            id="habito_exterior"
            textarea
            rows={3}
            placeholder="Descripción del hábito exterior del paciente: talla, complexión, estado nutricional, facies y actitud"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow htmlFor="exploracion_fisica" label="Exploración Física">
          <Input
            {...register('exploracion_fisica')}
            id="exploracion_fisica"
            textarea
            rows={3}
            placeholder="Descripción de hallazgos de la exploración física general"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Grid>
    </div>
  )
}
