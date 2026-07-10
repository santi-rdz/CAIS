import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'

export default function PreferenciasStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6">
      <Heading as="h4" showBar>
        Selección y Preferencias Alimentarias
      </Heading>
      <p className="text-5 -mt-3 text-zinc-500">
        Describe las preferencias y aversiones alimentarias del paciente.
      </p>

      <FormRow
        htmlFor="alimentos_disgusta"
        label="Describa los alimentos que le desagradan al paciente (si aplica)"
      >
        <Input
          {...register('alimentos_disgusta')}
          id="alimentos_disgusta"
          textarea
          rows={7}
          placeholder="Ej: No le gustan los lácteos, evita las verduras de hoja verde, rechaza las legumbres…"
          variant="outline"
          hasError={errors?.alimentos_disgusta?.message}
        />
      </FormRow>

      <div className="text-6 space-y-1 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 text-zinc-500">
        <p className="text-5 font-semibold text-zinc-700">Información adicional</p>
        <p>• Sea específico sobre los alimentos que el paciente rechaza o evita.</p>
        <p>• Incluya texturas, sabores o preparaciones que le disgustan.</p>
      </div>
    </div>
  )
}
