import { Controller, useFormContext } from 'react-hook-form'
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

export default function AntecedentesNoPatStep() {
  const { control, register } = useFormContext()

  return (
    <div className="space-y-6">
      {/* ── Servicios del Hogar ── */}
      <div className="space-y-3">
        <Heading as="h3" showBar required>
          Servicios del Hogar
        </Heading>
        <Grid cols={3} gap={4} mobileCols={2}>
          {SERVICIOS.map(({ name, label }) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <Checkbox
                  id={name}
                  checked={field.value}
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
          <FormRow label="Influenza">
            <DatePickerComponent
              name="influenza"
              control={control}
              birthdate={true}
              label="DD/MM/AAAA"
            />
          </FormRow>
          <FormRow label="Tétanos">
            <DatePickerComponent
              name="tetanos"
              control={control}
              birthdate={true}
              label="DD/MM/AAAA"
            />
          </FormRow>
          <FormRow label="Hepatitis B">
            <DatePickerComponent
              name="hepatitis_b"
              control={control}
              birthdate={true}
              label="DD/MM/AAAA"
            />
          </FormRow>
          <FormRow label="COVID-19">
            <DatePickerComponent
              name="covid_19"
              control={control}
              birthdate={true}
              label="DD/MM/AAAA"
            />
          </FormRow>
        </Grid>

        <FormRow htmlFor="otros" label="Otras vacunas">
          <Input
            {...register('otros')}
            id="otros"
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  fullWidth
                >
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
            <p className="text-5 mb-2 block">
              ¿Recibió las de la Infancia Completa?
            </p>
            <Controller
              name="vacunas_infancia_completas"
              control={control}
              render={({ field }) => (
                <div className="flex gap-4 py-2.5">
                  <Checkbox
                    id="vacunas_si"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    label="Sí"
                  />
                  <Checkbox
                    id="vacunas_no"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    label="No"
                  />
                </div>
              )}
            />
          </div>
        </Grid>
      </div>
    </div>
  )
}
