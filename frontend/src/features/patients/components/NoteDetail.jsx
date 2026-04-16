import { HiOutlineArrowLeft, HiOutlinePencilSquare } from 'react-icons/hi2'
import Tab from '@components/Tab'
import Heading from '@components/Heading'
import Button from '@components/Button'
import DataField from './DataField'
import SignosVitalesSection from '../historia/sections/SignosVitalesSection'
import FieldsSection from '../historia/sections/FieldsSection'
import { buildAparSistFields } from '../historia/constants'
import { formatFecha, formatHora } from '@lib/dateHelpers'

function ConsultaTab({
  motivo_consulta,
  ant_gine_andro,
  estudios_complementarios_efectuados,
}) {
  const hasContent =
    motivo_consulta || ant_gine_andro || estudios_complementarios_efectuados

  if (!hasContent)
    return (
      <p className="text-5 py-8 text-center text-zinc-400">
        Sin información de consulta registrada.
      </p>
    )

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Heading as="h4" showBar>
          Motivo de Consulta
        </Heading>
        <div className="flex flex-col gap-4">
          <DataField
            label="Motivo de consulta"
            value={motivo_consulta}
            multiline
            block
          />
          {ant_gine_andro && (
            <DataField
              label="Antec. gin./androl."
              value={ant_gine_andro}
              multiline
              block
            />
          )}
          {estudios_complementarios_efectuados && (
            <DataField
              label="Estudios complementarios efectuados"
              value={estudios_complementarios_efectuados}
              multiline
              block
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PlanTab({ planes_estudio }) {
  if (!planes_estudio)
    return (
      <p className="text-5 py-8 text-center text-zinc-400">
        Sin plan de estudio registrado.
      </p>
    )

  const {
    cie10_codes = [],
    plan_tratamiento,
    tratamiento,
    estudios_complementarios,
  } = planes_estudio

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Heading as="h4" showBar>
          Plan y Diagnóstico
        </Heading>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <DataField
            label="Plan de tratamiento"
            value={plan_tratamiento}
            multiline
            block
          />
          <DataField label="Tratamiento" value={tratamiento} multiline block />
        </div>
      </div>

      {estudios_complementarios && (
        <div className="space-y-3">
          <Heading as="h4" showBar>
            Estudios Complementarios
          </Heading>
          <DataField
            label="Estudios complementarios"
            value={estudios_complementarios}
            multiline
            block
          />
        </div>
      )}

      {cie10_codes.length > 0 && (
        <div className="space-y-2">
          <p className="text-6 font-semibold tracking-widest text-zinc-400 uppercase">
            Diagnóstico CIE-10
          </p>
          <div className="flex flex-wrap gap-2">
            {cie10_codes.map(({ codigo, descripcion }) => (
              <div
                key={codigo}
                className="inline-flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5"
              >
                <span className="text-5 shrink-0 font-bold text-blue-700">
                  {codigo}
                </span>
                {descripcion && (
                  <>
                    <div className="h-4 w-px shrink-0 bg-blue-200" />
                    <span className="text-5 text-blue-600">{descripcion}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function NoteDetail({ note, onBack, onEdit }) {
  const {
    motivo_consulta,
    ant_gine_andro,
    estudios_complementarios_efectuados,
    planes_estudio,
    aparatos_sistemas,
    informacion_fisica,
    usuarios,
    creado_at,
  } = note

  const date = formatFecha(creado_at)
  const hour = formatHora(creado_at)
  const doctorName = usuarios?.nombre
  const doctorPhoto = usuarios?.foto

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-zinc-50/60 px-5 py-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">Notas</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-5 font-mono font-semibold text-zinc-700">
            {date ?? '—'}
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-5 font-mono">{hour ?? '--:--'} h</span>
          {doctorName && (
            <>
              <span className="text-zinc-300">•</span>
              <span className="flex min-w-0 items-center gap-1.5">
                {doctorPhoto ? (
                  <img
                    src={doctorPhoto}
                    alt={doctorName}
                    className="h-5 w-5 shrink-0 rounded-full object-cover"
                  />
                ) : null}
                <span className="text-5 truncate">{doctorName}</span>
              </span>
            </>
          )}
        </div>
        <Button
          variant="secondary"
          size="md"
          className="gap-1.5"
          onClick={onEdit}
        >
          <HiOutlinePencilSquare size={14} />
          Editar nota
        </Button>
      </div>

      {/* Tabs — variant underline, igual que PatientHistoria */}
      <Tab variant="underline" defaultTab="consulta">
        <Tab.List>
          <Tab.Trigger value="consulta">Consulta</Tab.Trigger>
          <Tab.Trigger value="aparatos">Aparatos y sistemas</Tab.Trigger>
          <Tab.Trigger value="exploracion">Exploración física</Tab.Trigger>
          <Tab.Trigger value="plan">Plan y diagnóstico</Tab.Trigger>
        </Tab.List>

        <div className="p-5">
          <Tab.Panel value="consulta" scrollable={false}>
            <ConsultaTab
              motivo_consulta={motivo_consulta}
              ant_gine_andro={ant_gine_andro}
              estudios_complementarios_efectuados={
                estudios_complementarios_efectuados
              }
            />
          </Tab.Panel>

          <Tab.Panel value="aparatos" scrollable={false}>
            <FieldsSection
              fields={buildAparSistFields(aparatos_sistemas)}
              cols={3}
            />
          </Tab.Panel>

          <Tab.Panel value="exploracion" scrollable={false}>
            <SignosVitalesSection info={informacion_fisica} />
          </Tab.Panel>

          <Tab.Panel value="plan" scrollable={false}>
            <PlanTab planes_estudio={planes_estudio} />
          </Tab.Panel>
        </div>
      </Tab>
    </div>
  )
}
