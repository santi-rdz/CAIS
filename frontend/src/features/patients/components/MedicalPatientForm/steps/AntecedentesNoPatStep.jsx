import { Controller, useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
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
  { name: 'srv_gas', label: 'Gas' },
  { name: 'srv_drenaje', label: 'Drenaje' },
  { name: 'srv_luz', label: 'Electricidad / Luz' },
  { name: 'srv_cableTel', label: 'Casa / Teléfono' },
  { name: 'srv_agua', label: 'Agua' },
  { name: 'srv_internet', label: 'Internet' },
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
        <div className="grid grid-cols-3 gap-x-6 gap-y-3">
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
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100" />

      {/* ── Inmunizaciones ── */}
      <div className="space-y-4">
        <Heading as="h3" showBar required>
          Inmunizaciones
        </Heading>

        <div className="grid grid-cols-4 gap-4">
          <FormRow label="Influenza">
            <DatePickerComponent
              name="inm_influenza"
              control={control}
              birthdate={true}
              label="DD/MM/AAAA"
            />
          </FormRow>
          <FormRow label="Tétanos">
            <DatePickerComponent
              name="inm_tetanos"
              control={control}
              birthdate={true}
              label="DD/MM/AAAA"
            />
          </FormRow>
          <FormRow label="Hepatitis B">
            <DatePickerComponent
              name="inm_hepatitisB"
              control={control}
              birthdate={true}
              label="DD/MM/AAAA"
            />
          </FormRow>
          <FormRow label="COVID-19">
            <DatePickerComponent
              name="inm_covid19"
              control={control}
              birthdate={true}
              label="DD/MM/AAAA"
            />
          </FormRow>
        </div>

        <FormRow htmlFor="inm_otros" label="Otras vacunas">
          <Input
            {...register('inm_otros')}
            id="inm_otros"
            type="text"
            placeholder="Especifica otras vacunas aplicadas"
            variant="outline"
            size="md"
          />
        </FormRow>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100" />

      {/* ── Información Adicional ── */}
      <div className="space-y-4">
        <Heading as="h3" showBar>
          Información Adicional
        </Heading>

        <div className="grid grid-cols-2 items-end gap-4">
          <FormRow label="Tipo de Sangre y RH">
            <Controller
              name="tipoSangre"
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
              name="vacunasInfanciaCompletas"
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
        </div>
      </div>
    </div>
  )
}
