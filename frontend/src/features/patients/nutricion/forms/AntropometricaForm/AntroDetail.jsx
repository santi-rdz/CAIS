import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import Tab from '@components/Tab'
import Button from '@components/Button'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import { useTabStep } from '@hooks/useTabStep'
import { formatFecha } from '@lib/dateHelpers'

// Tab del detalle → step de AntropometricaForm (mismo orden que los STEPS ahí).
const TAB_TO_STEP = { t0: 0, t1: 1, t2: 2 }

function siNo(v) {
  if (v === true) return 'Sí'
  if (v === false) return 'No'
  return null
}

function adultoSections(base, adulto) {
  return [
    {
      label: 'Estructura y Peso',
      fields: [
        { label: 'Estatura (cm)', value: base.estatura },
        { label: 'Ancho de codo (mm)', value: adulto.codo },
        { label: 'Frisancho (percentil)', value: adulto.frisancho },
        { label: 'Complexión', value: adulto.complexion },
        { label: 'Peso ideal (kg)', value: adulto.pi_kg },
        { label: 'Peso actual (kg)', value: base.peso_actual },
        { label: 'Edema / líquido (kg)', value: adulto.edema_liq },
        { label: 'Peso sin edema (kg)', value: adulto.peso_sin_edema },
        { label: 'Peso ajustado (kg)', value: adulto.peso_ajustado },
        { label: '% Peso ideal', value: adulto.peso_ideal_por },
        { label: 'Diagnóstico PI', value: adulto.diagnostico_pi },
      ],
    },
    {
      label: 'IMC y Pliegues',
      fields: [
        { label: 'IMC (kg/m²)', value: base.imc },
        { label: 'Diagnóstico IMC', value: adulto.diagnostico_imc },
        { label: 'PB (cm)', value: base.pb },
        { label: 'PCB (mm)', value: adulto.pcb },
        { label: 'PCT (mm)', value: base.pct },
        { label: 'PCSE (mm)', value: base.pcse },
        { label: 'PCSI (mm)', value: adulto.pcsi },
        { label: 'Pantorrilla (cm)', value: base.pantorrilla },
      ],
    },
    {
      label: 'Riesgo Cardiovascular',
      fields: [
        { label: 'Cintura (cm)', value: base.cintura },
        { label: 'Indicador de riesgo (cintura)', value: siNo(adulto.riesgo_cv) },
        { label: 'Cadera (cm)', value: adulto.cadera },
        { label: 'Índice cintura-cadera', value: adulto.indice_cintura_cadera },
        { label: 'Diagnóstico ICC', value: adulto.diagnostico_icc },
        { label: 'Cuello (cm)', value: adulto.circuf_cuello },
        { label: 'Indicador de riesgo (cuello)', value: siNo(adulto.riesgo_eo_inf) },
      ],
    },
  ]
}

function kidSections(base, kid) {
  return [
    {
      label: 'Mediciones y Pliegues',
      fields: [
        { label: 'Peso actual (kg)', value: base.peso_actual },
        { label: 'Estatura (cm)', value: base.estatura },
        { label: 'IMC (kg/m²)', value: base.imc },
        { label: 'DE o percentilas (IMC)', value: kid.percentiles_imc },
        { label: 'Interpretación (IMC)', value: kid.interpretacion_imc },
        { label: 'Pantorrilla (cm)', value: base.pantorrilla },
        { label: 'Cintura (cm)', value: base.cintura },
        { label: 'DE o percentilas (Cintura)', value: kid.percentiles_cintura },
        { label: 'PB (cm)', value: base.pb },
        { label: 'DE o percentilas (PB)', value: kid.percentiles_pb },
        { label: 'PCT (mm)', value: base.pct },
        { label: 'DE o percentilas (PCT)', value: kid.percentiles_pct },
        { label: 'PCSE (mm)', value: base.pcse },
        { label: 'DE o percentilas (PCSE)', value: kid.percentiles_pcse },
      ],
    },
    {
      label: 'Indicadores de Crecimiento',
      fields: [
        { label: 'Peso/talla', value: kid.peso_para_talla },
        { label: 'Peso ideal (kg)', value: kid.peso_ideal },
        { label: 'DE peso/talla', value: kid.desviacion_estandar_peso },
        { label: 'Interpretación NOM (peso/talla)', value: kid.interpretacion_nom_peso },
        { label: 'Talla/edad', value: kid.talla_para_edad },
        { label: 'Talla ideal (cm)', value: kid.talla_ideal },
        { label: 'DE talla/edad', value: kid.desviacion_estandar_talla },
        { label: 'Interpretación NOM (talla/edad)', value: kid.interpretacion_nom_talla },
        { label: 'Peso/edad', value: kid.peso_para_edad },
        { label: 'DE peso/edad', value: kid.desviacion_estandar_peso_edad },
        { label: 'Interpretación NOM (peso/edad)', value: kid.interpretacion_nom_peso_edad },
      ],
    },
    {
      label: 'Diagnóstico y Vector',
      fields: [
        { label: 'Diagnóstico integral', value: kid.diagnostico_general },
        { label: 'Resistencia (Ω)', value: kid.resistencia },
        { label: 'Reactancia (Ω)', value: kid.reactancia },
        { label: 'Ángulo de fase (°)', value: kid.angulo_fase },
        { label: 'Tangente del ángulo', value: kid.tan_angulo_fase },
      ],
    },
  ]
}

export default function AntroDetail({ evalAntro, onBack, onEdit, onDelete }) {
  const { activeTab, setActiveTab, initialStep } = useTabStep(TAB_TO_STEP, undefined, 'antroTab')
  const adulto = evalAntro.eval_antro_ad_adulto_nutricion
  const esAdulto = Boolean(adulto)
  const sections = esAdulto
    ? adultoSections(evalAntro, adulto)
    : kidSections(evalAntro, evalAntro.eval_antro_ad_kid_nutricion ?? {})

  return (
    <div data-testid="antro-detail">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">Antropometría</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-5 font-semibold text-zinc-700">{formatFecha(evalAntro.fecha)}</span>
          <span className="text-7 rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-500">
            {esAdulto ? 'Adultos' : 'Infantil'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            className="p-2 text-zinc-400 hover:text-red-600"
            aria-label="Eliminar evaluación antropométrica"
            onClick={() => onDelete?.(evalAntro)}
          >
            <HiOutlineTrash size={16} />
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="gap-1.5"
            onClick={() => onEdit?.(initialStep)}
          >
            <HiOutlinePencilSquare size={14} />
            Editar evaluación
          </Button>
        </div>
      </div>

      <Tab variant="underline" value={activeTab} onValueChange={setActiveTab}>
        <Tab.List>
          {sections.map((s, i) => (
            <Tab.Trigger key={`t${i}`} value={`t${i}`}>
              {s.label}
            </Tab.Trigger>
          ))}
        </Tab.List>

        <div className="pt-5">
          {sections.map((s, i) => (
            <Tab.Panel key={`t${i}`} value={`t${i}`} scrollable={false}>
              <FieldsSection fields={s.fields} />
            </Tab.Panel>
          ))}
        </div>
      </Tab>
    </div>
  )
}
