import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'

export default function ExploracionFisicaStep() {
  const { register } = useFormContext()

  return (
    <div className="space-y-5">
      <Heading as="h3" showBar required>
        Exploración Física y Somatometría
      </Heading>

      {/* ── Somatometría ── */}
      <div className="space-y-4">
        <p className="text-5 font-medium text-zinc-700">Somatometría</p>

        <div className="grid grid-cols-4 gap-4">
          <FormRow htmlFor="if_peso" label="Peso / kg">
            <Input
              {...register('if_peso')}
              id="if_peso"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="if_altura" label="Altura / cm">
            <Input
              {...register('if_altura')}
              id="if_altura"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="if_paSistolica" label="T/A Sistólica">
            <Input
              {...register('if_paSistolica')}
              id="if_paSistolica"
              type="number"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="if_paDiastolica" label="T/A Diastólica">
            <Input
              {...register('if_paDiastolica')}
              id="if_paDiastolica"
              type="number"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <FormRow htmlFor="if_fc" label="FC (lpm)">
            <Input
              {...register('if_fc')}
              id="if_fc"
              type="number"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="if_fr" label="FR (rpm)">
            <Input
              {...register('if_fr')}
              id="if_fr"
              type="number"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="if_circCintura" label="Circ. Cintura (cm)">
            <Input
              {...register('if_circCintura')}
              id="if_circCintura"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="if_circCadera" label="Circ. Cadera (cm)">
            <Input
              {...register('if_circCadera')}
              id="if_circCadera"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <FormRow htmlFor="if_spO2" label="SpO₂ (%)">
            <Input
              {...register('if_spO2')}
              id="if_spO2"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="if_glucosaCapilar" label="Glucosa Capilar (mg/dL)">
            <Input
              {...register('if_glucosaCapilar')}
              id="if_glucosaCapilar"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
          <FormRow htmlFor="if_temperatura" label="Temperatura (°C)">
            <Input
              {...register('if_temperatura')}
              id="if_temperatura"
              type="number"
              step="0.1"
              placeholder="0000"
              variant="outline"
              size="md"
            />
          </FormRow>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100" />

      <div className="grid grid-cols-2 gap-4">
        <FormRow htmlFor="if_habitoExterior" label="Hábito Exterior">
          <Input
            {...register('if_habitoExterior')}
            id="if_habitoExterior"
            textarea
            rows={3}
            placeholder="Descripción del hábito exterior del paciente: talla, complexión, estado nutricional, facies y actitud"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow htmlFor="if_exploracionFisica" label="Exploración Física">
          <Input
            {...register('if_exploracionFisica')}
            id="if_exploracionFisica"
            textarea
            rows={3}
            placeholder="Descripción de hallazgos de la exploración física general"
            variant="outline"
            size="md"
          />
        </FormRow>
      </div>
    </div>
  )
}
