import { Controller, useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import Divider from '@components/Divider'
import Checkbox from '@components/Checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/Select'
import DatePickerComponent from '@ui/DatePickerComponent'

const SERVICIOS = [
  { name: 'gas', label: 'Gas' },
  { name: 'drenaje', label: 'Drenaje' },
  { name: 'luz', label: 'Electricidad / Luz' },
  { name: 'cable_tel', label: 'Casa / Teléfono' },
  { name: 'agua', label: 'Agua' },
  { name: 'internet', label: 'Internet' },
]

const TIPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const INMUNIZACIONES = [
  { name: 'inmunizaciones.influenza', label: 'Influenza' },
  { name: 'inmunizaciones.tetanos', label: 'Tétanos' },
  { name: 'inmunizaciones.hepatitis_b', label: 'Hepatitis B' },
  { name: 'inmunizaciones.covid_19', label: 'COVID-19' },
]

/** Campo booleano Sí / No con checkboxes. */
function YesNoField({ name, control, idPrefix }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex gap-4 py-1">
          <Checkbox
            id={`${idPrefix}_si`}
            checked={field.value === true}
            onChange={() => field.onChange(true)}
            label="Sí"
          />
          <Checkbox
            id={`${idPrefix}_no`}
            checked={field.value === false}
            onChange={() => field.onChange(false)}
            label="No"
          />
        </div>
      )}
    />
  )
}

export default function AntecedentesNoPatStep() {
  const { control, register } = useFormContext()
  const zoonosis = useWatch({ control, name: 'antecedentes_no_patologicos.zoonosis' })

  return (
    <div className="space-y-6">
      {/* ── Hábitos y Estilo de Vida ── */}
      <div className="space-y-4">
        <Heading as="h3" showBar>
          Hábitos y Estilo de Vida
        </Heading>

        <Grid cols={2} gap={4} mobileCols={1}>
          <div className="space-y-3">
            <p className="text-5 block">¿Alimentación adecuada?</p>
            <YesNoField
              name="antecedentes_no_patologicos.alimentacion_adecuada"
              control={control}
              idPrefix="alimentacion"
            />
          </div>

          <div className="space-y-3">
            <p className="text-5 block">¿Inmunizaciones completas?</p>
            <YesNoField
              name="antecedentes_no_patologicos.inmunizaciones_completas"
              control={control}
              idPrefix="inmunizaciones_completas"
            />
          </div>
        </Grid>

        <FormRow htmlFor="calidad_cantidad_alimentacion" label="Calidad y cantidad de alimentación">
          <Input
            {...register('antecedentes_no_patologicos.calidad_cantidad_alimentacion')}
            id="calidad_cantidad_alimentacion"
            textarea
            rows={2}
            placeholder="Describe la dieta habitual del paciente"
            variant="outline"
            size="md"
          />
        </FormRow>

        <Grid cols={2} gap={4} mobileCols={1}>
          <FormRow htmlFor="higiene_adecuada" label="Higiene">
            <Input
              {...register('antecedentes_no_patologicos.higiene_adecuada')}
              id="higiene_adecuada"
              textarea
              rows={2}
              placeholder="Hábitos de higiene personal"
              variant="outline"
              size="md"
            />
          </FormRow>

          <FormRow htmlFor="actividad_fisica" label="Actividad física">
            <Input
              {...register('antecedentes_no_patologicos.actividad_fisica')}
              id="actividad_fisica"
              textarea
              rows={2}
              placeholder="Tipo y frecuencia de actividad física"
              variant="outline"
              size="md"
            />
          </FormRow>
        </Grid>

        <Grid cols={2} gap={4} mobileCols={1} className="items-start">
          <div className="space-y-3">
            <p className="text-5 block">¿Zoonosis?</p>
            <YesNoField
              name="antecedentes_no_patologicos.zoonosis"
              control={control}
              idPrefix="zoonosis"
            />
          </div>

          {zoonosis === true && (
            <FormRow htmlFor="tipo_zoonosis" label="Tipo de zoonosis">
              <Input
                {...register('antecedentes_no_patologicos.tipo_zoonosis')}
                id="tipo_zoonosis"
                type="text"
                placeholder="Especifica el tipo de zoonosis"
                variant="outline"
                size="md"
              />
            </FormRow>
          )}
        </Grid>
      </div>

      <Divider />

      {/* ── Servicios del Hogar ── */}
      <div className="space-y-3">
        <Heading as="h3" showBar required>
          Servicios del Hogar
        </Heading>
        <Grid cols={3} gap={4} mobileCols={2}>
          {SERVICIOS.map(({ name, label }) => (
            <Controller
              key={name}
              name={`servicios.${name}`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  id={name}
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label={label}
                />
              )}
            />
          ))}
        </Grid>
      </div>

      <Divider />

      {/* ── Inmunizaciones ── */}
      <div className="space-y-4">
        <Heading as="h3" showBar required>
          Inmunizaciones
        </Heading>

        <Grid cols={4} gap={4} mobileCols={2}>
          {INMUNIZACIONES.map(({ name, label }) => (
            <FormRow key={name} label={label}>
              <DatePickerComponent
                name={name}
                control={control}
                birthdate={true}
                label="DD/MM/AAAA"
              />
            </FormRow>
          ))}
        </Grid>

        <FormRow htmlFor="otras_vacunas" label="Otras vacunas">
          <Input
            {...register('inmunizaciones.otros')}
            id="otras_vacunas"
            type="text"
            placeholder="Especifica otras vacunas aplicadas"
            variant="outline"
            size="md"
          />
        </FormRow>
      </div>

      <Divider />

      {/* ── Información Adicional ── */}
      <div className="space-y-4">
        <Heading as="h3" showBar>
          Información Adicional
        </Heading>

        <Grid cols={2} gap={4} mobileCols={2} className="items-end">
          <FormRow label="Tipo de Sangre y RH">
            <Controller
              name="tipo_sangre"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} fullWidth>
                  <SelectTrigger size="lg">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_SANGRE.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>
          <div className="flex flex-col gap-1">
            <p className="text-5 mb-2 block">¿Recibió las de la Infancia Completa?</p>
            <YesNoField
              name="vacunas_infancia_completas"
              control={control}
              idPrefix="vacunas"
            />
          </div>
        </Grid>
      </div>
    </div>
  )
}
