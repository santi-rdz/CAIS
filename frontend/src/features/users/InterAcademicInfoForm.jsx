import DomainEmailInput from '@ui/DomainEmailInput'
import FormRow from '@components/FormRow'
import Heading from '@components/Heading'
import Input from '@components/Input'
import Row from '@components/Row'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/Select'
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

export default function InterAcademicInfoForm({
  disabledEmail,
  isUabcDomain,
  setIsUabcDomain,
}) {
  const { register, control, formState } = useFormContext()
  const { errors } = formState

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar required>
        Información Académica
      </Heading>
      {disabledEmail ? (
        <FormRow htmlFor="correo" label="Correo electrónico">
          <Input
            {...register('correo')}
            id="correo"
            type="email"
            disabled
            variant="outline"
          />
        </FormRow>
      ) : (
        <DomainEmailInput
          id="correo"
          isDomain={isUabcDomain}
          setIsDomain={setIsUabcDomain}
          fieldName="correo"
          register={register}
          error={errors?.correo?.message}
        />
      )}

      <FormRow htmlFor="matricula" label="Matricula">
        <Input
          {...register('matricula')}
          id="matricula"
          type="text"
          placeholder="e.g 1299332"
          hasError={errors?.matricula?.message}
          variant="outline"
          suffix={
            <HiOutlineIdentification size={20} className="text-gray-400" />
          }
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
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  hasError={!!errors?.servicioInicioAnio}
                  className="flex-1"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y.value} value={y.value}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="servicioInicioPeriodo"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  hasError={!!errors?.servicioInicioPeriodo}
                  className="flex-1"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIODS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {(errors?.servicioInicioAnio || errors?.servicioInicioPeriodo) && (
            <span className="text-5 mt-1.5 inline-block text-red-600">
              Selecciona año y periodo de inicio
            </span>
          )}
        </div>

        {/* Fin de Servicio */}
        <div className="flex-1">
          <p className="text-5 mb-2">Fin de Servicio</p>
          <div className="flex gap-2">
            <Controller
              name="servicioFinAnio"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  hasError={!!errors?.servicioFinAnio}
                  className="flex-1"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y.value} value={y.value}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="servicioFinPeriodo"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  hasError={!!errors?.servicioFinPeriodo}
                  className="flex-1"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIODS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {(errors?.servicioFinAnio || errors?.servicioFinPeriodo) && (
            <span className="text-5 mt-1.5 inline-block text-red-600">
              Selecciona año y periodo de fin
            </span>
          )}
        </div>
      </Row>
    </div>
  )
}
