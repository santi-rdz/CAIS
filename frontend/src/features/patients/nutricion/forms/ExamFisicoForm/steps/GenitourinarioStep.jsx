import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'

const CONDICIONES = [
  { term: 'Amenorrea', desc: 'Ausencia de menstruación' },
  { term: 'Anuria', desc: 'Falta de producción de orina' },
  { term: 'Retraso del desarrollo sexual', desc: 'Desarrollo sexual tardío o incompleto' },
  { term: 'Menorragia', desc: 'Sangrado menstrual excesivo' },
  { term: 'Oliguria', desc: 'Disminución en la producción de orina' },
  { term: 'Poliuria', desc: 'Aumento en la producción de orina' },
]

export default function GenitourinarioStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6">
      <Heading as="h4" showBar>
        Sistema Genitourinario
      </Heading>

      <FormRow
        htmlFor="genitourinario"
        label="Observaciones"
        hint="Amenorrea, anuria, retraso del desarrollo sexual, menorragia, oliguria, poliuria (opcional, descriptivo)."
      >
        <Input
          {...register('semiologia.descripcion_sist_genito_urinario')}
          id="genitourinario"
          textarea
          rows={6}
          placeholder="Escribir observaciones del sistema genitourinario…"
          variant="outline"
          hasError={errors?.semiologia?.descripcion_sist_genito_urinario?.message}
        />
      </FormRow>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
        <p className="text-5 mb-2 font-semibold text-zinc-700">
          Condiciones comunes del sistema genitourinario
        </p>
        <ul className="space-y-1">
          {CONDICIONES.map(({ term, desc }) => (
            <li key={term} className="text-6 text-zinc-500">
              <span className="font-semibold text-zinc-600">{term}:</span> {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
