import { Controller, useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import SegmentedToggle from '@components/SegmentedToggle'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'
import { FRECUENCIA_OPTIONS } from '@features/patients/nutricion/constants'

// ── Config de las 4 adicciones ────────────────────────────────────────────────

const ADICCIONES = [
  {
    key: 'tabaco',
    label: 'Tabaco',
    activoField: 'adicto_tabaco',
    frecField: 'tabaco_frecuencia',
    metricField: 'num_cigarros_d',
    metricLabel: 'Núm. cigarro/d',
    metricPlaceholder: '0',
    metricType: 'number',
  },
  {
    key: 'alcohol',
    label: 'Alcohol',
    activoField: 'adicto_alcohol',
    frecField: 'alcohol_frecuencia',
    metricField: 'ml_ocasion',
    metricLabel: 'ml por ocasión',
    metricPlaceholder: '0',
    metricType: 'number',
  },
  {
    key: 'drogas',
    label: 'Drogas',
    activoField: 'adicto_droga',
    frecField: 'drogas_frecuencia',
    metricField: 'cual_droga',
    metricLabel: '¿Cuál?',
    metricPlaceholder: 'Tipo de droga',
    metricType: 'text',
  },
  {
    key: 'med_controlado',
    label: 'Med. Controlado',
    activoField: 'adicto_med_contr',
    frecField: 'med_contr_frecuencia',
    metricField: 'cual_med_contr',
    metricLabel: '¿Cuál?',
    metricPlaceholder: 'Nombre del medicamento',
    metricType: 'text',
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function AdiccionItem({ adic, control, register, errors }) {
  const activo = useWatch({ control, name: `adicciones.${adic.activoField}` })
  const isActive = activo === 'si'

  return (
    <div className="border-b border-zinc-100 py-4 last:border-0">
      <div className="flex items-center justify-between gap-4">
        <span className="text-4 font-semibold text-zinc-800">{adic.label}</span>
        <Controller
          name={`adicciones.${adic.activoField}`}
          control={control}
          render={({ field }) => (
            <SegmentedToggle
              value={field.value}
              onChange={field.onChange}
              ariaLabel={`¿Consume ${adic.label}?`}
            />
          )}
        />
      </div>

      {isActive && (
        <div className="mt-3 grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <FormRow label="Frecuencia">
            <Controller
              name={`adicciones.${adic.frecField}`}
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} fullWidth>
                  <SelectTrigger size="md">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {FRECUENCIA_OPTIONS.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>

          <FormRow label={adic.metricLabel}>
            <Input
              {...register(`adicciones.${adic.metricField}`)}
              type={adic.metricType}
              min={adic.metricType === 'number' ? 0 : undefined}
              placeholder={adic.metricPlaceholder}
              variant="outline"
              size="md"
              hasError={errors?.adicciones?.[adic.metricField]?.message}
            />
          </FormRow>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdiccionesStep() {
  const { register, control, formState } = useFormContext()
  const { errors } = formState

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar>
        Adicciones
      </Heading>
      <p className="text-6 text-zinc-500">Información sobre hábitos de consumo del paciente.</p>

      <div className="border-t border-zinc-100">
        {ADICCIONES.map((adic) => (
          <AdiccionItem
            key={adic.key}
            adic={adic}
            control={control}
            register={register}
            errors={errors}
          />
        ))}
      </div>
    </div>
  )
}
