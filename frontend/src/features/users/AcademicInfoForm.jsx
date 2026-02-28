import DomainEmailInput from '@ui/DomainEmailInput'
import FormRow from '@ui/FormRow'
import Input from '@ui/Input'
import Row from '@ui/Row'
import Select from '@ui/Select'
import { Controller, useFormContext } from 'react-hook-form'
import { HiOutlineIdentification } from 'react-icons/hi2'

const YEARS = Array.from({ length: 3 }, (_, i) => {
  const year = new Date().getFullYear() - 2 + i
  return { value: String(year), label: String(year) }
})

const PERIODS = [
  { value: '1', label: 'Enero - Junio' },
  { value: '2', label: 'Julio - Diciembre' },
]

export default function AcademicInfoForm() {
  const { register, control, formState } = useFormContext()
  const { errors } = formState

  return (
    <div className="space-y-4">
      <DomainEmailInput id="username" fieldName="username" register={register} error={errors?.username?.message} />

      <FormRow htmlFor="matricula" label="Matricula">
        <Input
          {...register('matricula', { required: 'Ingresa la matrícula' })}
          id="matricula"
          type="text"
          placeholder="e.g 1299332"
          hasError={errors?.matricula?.message}
          variant="outline"
          suffix={<HiOutlineIdentification size={20} className="text-gray-400" />}
        />
      </FormRow>

      <Row className="gap-8">
        {/* Inicio de Servicio */}
        <div className="flex-1">
          <p className="text-5 mb-2">Inicio de Servicio</p>
          <div className="flex gap-2">
            <Controller
              name="servicioInicioAnio"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={YEARS}
                  value={YEARS.find((y) => y.value === field.value) ?? null}
                  onChange={field.onChange}
                  placeholder="Año"
                  hasError={!!errors?.servicioInicioAnio}
                  className="flex-1"
                />
              )}
            />
            <Controller
              name="servicioInicioPeriodo"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={PERIODS}
                  value={PERIODS.find((p) => p.value === field.value) ?? null}
                  onChange={field.onChange}
                  placeholder="Periodo"
                  hasError={!!errors?.servicioInicioPeriodo}
                  className="flex-1"
                />
              )}
            />
          </div>
          {(errors?.servicioInicioAnio || errors?.servicioInicioPeriodo) && (
            <span className="text-5 mt-1.5 inline-block text-red-600">Selecciona año y periodo de inicio</span>
          )}
        </div>

        {/* Fin de Servicio */}
        <div className="flex-1">
          <p className="text-5 mb-2">Fin de Servicio</p>
          <div className="flex gap-2">
            <Controller
              name="servicioFinAnio"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={YEARS}
                  value={YEARS.find((y) => y.value === field.value) ?? null}
                  onChange={field.onChange}
                  placeholder="Año"
                  hasError={!!errors?.servicioFinAnio}
                  className="flex-1"
                />
              )}
            />
            <Controller
              name="servicioFinPeriodo"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={PERIODS}
                  value={PERIODS.find((p) => p.value === field.value) ?? null}
                  onChange={field.onChange}
                  placeholder="Periodo"
                  hasError={!!errors?.servicioFinPeriodo}
                  className="flex-1"
                />
              )}
            />
          </div>
          {(errors?.servicioFinAnio || errors?.servicioFinPeriodo) && (
            <span className="text-5 mt-1.5 inline-block text-red-600">Selecciona año y periodo de fin</span>
          )}
        </div>
      </Row>
    </div>
  )
}
