import { Controller, useFormContext } from 'react-hook-form'
import { HiOutlineEnvelope, HiOutlineMapPin } from 'react-icons/hi2'
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
import BirthdayField from '@ui/BirthdayField'
import PhoneField from '@ui/PhoneField'

export default function DatosPersonalesStep() {
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
          <BirthdayField
            name="fecha_nacimiento"
            control={control}
            errors={errors}
          />
          <PhoneField />
          <FormRow label="Género" required>
            <Controller
              name="genero"
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
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>
        </Grid>

        <Controller
          name="es_externo"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="es_externo"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              label="Paciente externo"
            />
          )}
        />
      </div>

      <Divider />

      {/* ══ 2 · Información Adicional ══ */}
      <div className="space-y-4">
        <Heading as="h3" showBar>
          Información Adicional
        </Heading>

        <Grid cols={3} gap={4} mobileCols={2}>
          <FormRow label="Fuente de Información">
            <Controller
              name="fuente_informacion"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  fullWidth
                >
                  <SelectTrigger size="lg">
                    <SelectValue placeholder="Directo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Directo">Directo</SelectItem>
                    <SelectItem value="Referido">Referido</SelectItem>
                    <SelectItem value="Urgencias">Urgencias</SelectItem>
                    <SelectItem value="Cita previa">Cita previa</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>
          <FormRow htmlFor="nss" label="NSS">
            <Input
              {...register('nss')}
              id="nss"
              type="text"
              placeholder="Número de Seguro Social"
              variant="outline"
              size="lg"
            />
          </FormRow>
          <FormRow htmlFor="curp_matricula" label="CURP / Matrícula">
            <Input
              {...register('curp_matricula', {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase()
                },
              })}
              id="curp_matricula"
              type="text"
              placeholder="00000000000"
              variant="outline"
              size="lg"
            />
          </FormRow>
        </Grid>

        <Grid cols={3} gap={4} mobileCols={2}>
          <FormRow label="Estado Civil">
            <Controller
              name="estado_civil"
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
                    <SelectItem value="Soltero/a">Soltero/a</SelectItem>
                    <SelectItem value="Casado/a">Casado/a</SelectItem>
                    <SelectItem value="Divorciado/a">Divorciado/a</SelectItem>
                    <SelectItem value="Viudo/a">Viudo/a</SelectItem>
                    <SelectItem value="Unión libre">Unión libre</SelectItem>
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
              placeholder="correo@uabc.edu.mx"
              variant="outline"
              size="lg"
              suffix={<HiOutlineEnvelope className="text-zinc-400" />}
            />
          </FormRow>
          <FormRow htmlFor="ocupacion" label="Ocupación">
            <Input
              {...register('ocupacion')}
              id="ocupacion"
              type="text"
              placeholder="Ocupación del paciente"
              variant="outline"
              size="lg"
            />
          </FormRow>
        </Grid>

        <Grid cols={3} gap={4} mobileCols={2}>
          <FormRow htmlFor="religion" label="Religión">
            <Input
              {...register('religion')}
              id="religion"
              type="text"
              placeholder="Religión"
              variant="outline"
              size="lg"
            />
          </FormRow>
          <FormRow htmlFor="lugar_nacimiento" label="Lugar de Nacimiento">
            <Input
              {...register('lugar_nacimiento')}
              id="lugar_nacimiento"
              type="text"
              placeholder="Ciudad, Estado"
              variant="outline"
              size="lg"
              suffix={<HiOutlineMapPin className="text-zinc-400" />}
            />
          </FormRow>
          <FormRow htmlFor="domicilio" label="Domicilio">
            <Input
              {...register('domicilio')}
              id="domicilio"
              type="text"
              placeholder="Calle, número, colonia"
              variant="outline"
              size="lg"
            />
          </FormRow>
        </Grid>

        <Divider />

        {/* ─ Contacto de Emergencia ─ */}
        <div className="space-y-3">
          <Heading as="h3" showBar>
            Contacto de Emergencia
          </Heading>
          <Grid cols={3} gap={4} mobileCols={2}>
            <FormRow htmlFor="contacto_emergencia" label="Nombre">
              <Input
                {...register('contacto_emergencia')}
                id="contacto_emergencia"
                type="text"
                placeholder="Nombre completo"
                variant="outline"
                size="lg"
              />
            </FormRow>
            <FormRow htmlFor="parentesco_emergencia" label="Relación">
              <Input
                {...register('parentesco_emergencia')}
                id="parentesco_emergencia"
                type="text"
                placeholder="Ej: Esposo/a, Hijo/a"
                variant="outline"
                size="lg"
              />
            </FormRow>
            <PhoneField
              name="telefono_emergencia"
              label="Teléfono"
              required={false}
            />
          </Grid>
        </div>
      </div>
    </div>
  )
}
