import { Controller, useFormContext } from 'react-hook-form'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import Divider from '@components/Divider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'
import BirthdayField from '@ui/BirthdayField'
import PhoneField from '@ui/PhoneField'
import {
  ESCOLARIDAD_OPTIONS,
  OCUPACION_NUTR_OPTIONS,
  ESTADO_CIVIL_NUTR_OPTIONS,
  SALARIO_DIA_OPTIONS,
} from '@features/patients/nutricion/constants'

export default function IdentificacionNutrStep() {
  const { register, control, formState } = useFormContext()
  const { errors } = formState

  return (
    <div className="space-y-6">
      {/* ══ 1 · Información Básica Requerida ══ */}
      <div className="space-y-4">
        <Heading as="h3" showBar required>
          Información Básica Requerida
        </Heading>

        <Grid cols={2} gap={4} mobileCols={2}>
          <FormRow htmlFor="nombre" label="Nombre(s)" required>
            <Input
              {...register('nombre')}
              id="nombre"
              type="text"
              placeholder="Ingrese nombre(s)"
              hasError={errors?.nombre?.message}
              variant="outline"
              size="lg"
            />
          </FormRow>
          <FormRow htmlFor="apellidos" label="Apellidos" required>
            <Input
              {...register('apellidos')}
              id="apellidos"
              type="text"
              placeholder="Ingrese apellidos"
              hasError={errors?.apellidos?.message}
              variant="outline"
              size="lg"
            />
          </FormRow>
        </Grid>

        <Grid cols={3} gap={4} mobileCols={2}>
          <BirthdayField name="fecha_nacimiento" control={control} errors={errors} />
          <PhoneField />
          <FormRow label="Género" required>
            <Controller
              name="genero"
              control={control}
              hasError={errors?.genero?.message}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} fullWidth>
                  <SelectTrigger size="lg" hasError={errors?.genero?.message}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>
        </Grid>

        <FormRow htmlFor="motivo_consulta" label="Motivo de consulta">
          <Input
            {...register('motivo_consulta')}
            id="motivo_consulta"
            textarea
            placeholder="Motivo de la consulta"
            hasError={errors?.motivo_consulta?.message}
            variant="outline"
            size="lg"
          />
        </FormRow>
      </div>

      <Divider />

      {/* ══ 2 · Información Adicional ══ */}
      <div className="space-y-4">
        <Heading as="h3" showBar>
          Información Adicional
        </Heading>

        <Grid cols={3} gap={4} mobileCols={2}>
          <FormRow label="Ocupación">
            <Controller
              name="ocupacion"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} fullWidth>
                  <SelectTrigger size="lg">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {OCUPACION_NUTR_OPTIONS.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>
          <FormRow label="Estado Civil">
            <Controller
              name="estado_civil"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} fullWidth>
                  <SelectTrigger size="lg">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADO_CIVIL_NUTR_OPTIONS.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>
          <FormRow htmlFor="correo" label="Correo Electrónico">
            <Input
              {...register('correo')}
              id="correo"
              type="email"
              placeholder="correo@ejemplo.com"
              hasError={errors?.correo?.message}
              variant="outline"
              size="lg"
              suffix={<HiOutlineEnvelope className="text-zinc-400" />}
            />
          </FormRow>
        </Grid>

        <Grid cols={3} gap={4} mobileCols={2}>
          <FormRow label="Escolaridad">
            <Controller
              name="nivel_educativo"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} fullWidth>
                  <SelectTrigger size="lg">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESCOLARIDAD_OPTIONS.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>
          <FormRow label="Salario/día">
            <Controller
              name="salario_dia"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} fullWidth>
                  <SelectTrigger size="lg">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARIO_DIA_OPTIONS.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>
        </Grid>
      </div>
    </div>
  )
}
