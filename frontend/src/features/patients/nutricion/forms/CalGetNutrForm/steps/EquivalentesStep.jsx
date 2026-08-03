import { useFormContext } from 'react-hook-form'
import { EQUIVALENTES_NUTRICIONALES } from '@cais/shared/constants/nutricion'
import {
  calcularTotalesNutricionales,
  calcularObjetivosGET,
} from '@cais/shared/calculations/nutricion'
import Heading from '@components/Heading'
import Input from '@components/Input'
import { formatNumber } from '@lib/utils'
import {
  EQUIVALENTE_LABELS,
  EQUIVALENTE_SECTIONS,
} from '@features/patients/nutricion/forms/CalGetNutrForm/fieldConfig'
import ObtenidoVsTeoricoPanel from '@features/patients/nutricion/forms/CalGetNutrForm/ObtenidoVsTeoricoPanel'

const GRID = 'grid grid-cols-[1.7fr_84px_repeat(4,1fr)] gap-3 items-center'

function GrupoRow({ grupo, value, register, errors }) {
  const base = EQUIVALENTES_NUTRICIONALES[grupo]
  const eq = Number(value) || 0

  return (
    <div className={`${GRID} px-4 py-2`}>
      <span className="text-5 text-zinc-700">{EQUIVALENTE_LABELS[grupo]}</span>
      <Input
        {...register(grupo)}
        id={grupo}
        type="number"
        step="1"
        min="0"
        variant="outline"
        size="sm"
        hasError={errors?.[grupo]?.message}
      />
      <span className="text-5 text-right text-zinc-500 tabular-nums">
        {formatNumber(eq * base.kcal)}
      </span>
      <span className="text-5 text-right text-zinc-500 tabular-nums">
        {formatNumber(eq * base.proteinas)}
      </span>
      <span className="text-5 text-right text-zinc-500 tabular-nums">
        {formatNumber(eq * base.grasas)}
      </span>
      <span className="text-5 text-right text-zinc-500 tabular-nums">
        {formatNumber(eq * base.carbohidratos)}
      </span>
    </div>
  )
}

export default function EquivalentesStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext()

  const values = watch()
  const obtenido = calcularTotalesNutricionales(values)
  const objetivos = calcularObjetivosGET(values)

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Heading as="h4" showBar>
          Distribución de equivalentes
        </Heading>
        <p className="text-5 -mt-1 text-zinc-500">
          Cantidad de unidades de intercambio (EQ) por grupo. La energía y los macronutrientes se
          calculan en automático.
        </p>

        <div className="space-y-5">
          {EQUIVALENTE_SECTIONS.map((section) => (
            <div key={section.title} className="overflow-hidden rounded-xl border border-zinc-100">
              <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2">
                <p className="text-6 font-semibold tracking-wide text-zinc-500 uppercase">
                  {section.title}
                </p>
              </div>
              <div
                className={`${GRID} text-6 border-b border-zinc-100 px-4 py-2 font-medium tracking-wide text-zinc-400 uppercase`}
              >
                <span>Grupo</span>
                <span>EQ</span>
                <span className="text-right">kcal</span>
                <span className="text-right">Ps (g)</span>
                <span className="text-right">Ls (g)</span>
                <span className="text-right">HC (g)</span>
              </div>
              <div className="divide-y divide-zinc-50">
                {section.grupos.map((grupo) => (
                  <GrupoRow
                    key={grupo}
                    grupo={grupo}
                    value={values[grupo]}
                    register={register}
                    errors={errors}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Balance: obtenido vs teórico
        </Heading>
        <ObtenidoVsTeoricoPanel obtenido={obtenido} objetivos={objetivos} />
      </section>
    </div>
  )
}
