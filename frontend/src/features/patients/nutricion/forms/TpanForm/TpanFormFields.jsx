import { Controller, useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import DatePickerComponent from '@ui/DatePickerComponent'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'
import { TPAN_PROGRESO_OPTIONS, TPAN_HINTS } from '@features/patients/nutricion/constants'

export default function TpanFormFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6">
      <FormRow label="Fecha de evaluación" error={errors?.fecha_eval?.message}>
        <DatePickerComponent
          name="fecha_eval"
          control={control}
          birthdate={false}
          hasError={errors?.fecha_eval?.message}
        />
      </FormRow>

      <section className="space-y-5 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Evaluación y diagnóstico
        </Heading>

        <FormRow htmlFor="eval_realizada" label="Evaluación realizada">
          <Input
            {...register('eval_realizada')}
            id="eval_realizada"
            type="text"
            placeholder="Ej: Valoración antropométrica"
            variant="outline"
            size="md"
            hasError={errors?.eval_realizada?.message}
          />
        </FormRow>

        <FormRow htmlFor="observacion" label="Observado" tooltip={TPAN_HINTS.observacion}>
          <Input
            {...register('observacion')}
            id="observacion"
            textarea
            rows={3}
            placeholder="Anote lo alterado que observó en la evaluación…"
            variant="outline"
            size="md"
            hasError={errors?.observacion?.message}
          />
        </FormRow>

        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <FormRow
            htmlFor="estandares_com"
            label="Estándares comparativos"
            tooltip={TPAN_HINTS.estandares_com}
          >
            <Input
              {...register('estandares_com')}
              id="estandares_com"
              type="text"
              placeholder="Ej: OMS, NOM"
              variant="outline"
              size="md"
              hasError={errors?.estandares_com?.message}
            />
          </FormRow>

          <FormRow htmlFor="decision" label="Decisión tomada">
            <Input
              {...register('decision')}
              id="decision"
              type="text"
              placeholder="Ej: Iniciar plan alimentario"
              variant="outline"
              size="md"
              hasError={errors?.decision?.message}
            />
          </FormRow>
        </div>
      </section>

      <section className="space-y-5 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Problema nutricio (PES)
        </Heading>

        <FormRow htmlFor="problema_iden" label="Problema nutricio identificado">
          <Input
            {...register('problema_iden')}
            id="problema_iden"
            textarea
            rows={2}
            placeholder="Describa el problema nutricio priorizado…"
            variant="outline"
            size="md"
            hasError={errors?.problema_iden?.message}
          />
        </FormRow>

        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <FormRow
            htmlFor="causa_probl"
            label="¿Qué causa el problema? (Asociado a…)"
            tooltip={TPAN_HINTS.causa_probl}
          >
            <Input
              {...register('causa_probl')}
              id="causa_probl"
              textarea
              rows={3}
              placeholder="Describe la causa del problema…"
              variant="outline"
              size="md"
              hasError={errors?.causa_probl?.message}
            />
          </FormRow>

          <FormRow
            htmlFor="evidencia_probl"
            label="¿Cuál es la evidencia del problema? (Evidenciado por…)"
            tooltip={TPAN_HINTS.evidencia_probl}
          >
            <Input
              {...register('evidencia_probl')}
              id="evidencia_probl"
              textarea
              rows={3}
              placeholder="Describe la evidencia del problema…"
              variant="outline"
              size="md"
              hasError={errors?.evidencia_probl?.message}
            />
          </FormRow>
        </div>

        <FormRow label="Progreso diagnóstico" tooltip={TPAN_HINTS.progreso}>
          <Controller
            name="progreso"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} fullWidth>
                <SelectTrigger size="md">
                  <SelectValue placeholder="Seleccionar progreso" />
                </SelectTrigger>
                <SelectContent>
                  {TPAN_PROGRESO_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormRow>
      </section>
    </div>
  )
}
