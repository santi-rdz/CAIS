import { HiOutlineArrowLeft, HiOutlinePencilSquare } from 'react-icons/hi2'
import Tab from '@components/Tab'
import Button from '@components/Button'
import DataField from '@components/DataField'
import MotivoConsultaSection from '../sections/MotivoConsultaSection'
import PlanEstudioSection from '../sections/PlanEstudioSection'
import SignosVitalesSection from '../sections/SignosVitalesSection'
import FieldsSection from '../sections/FieldsSection'
import { buildAparSistFields } from '../constants'
import { formatFecha, formatHora } from '@lib/dateHelpers'

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
            <MotivoConsultaSection motivo_consulta={motivo_consulta}>
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
            </MotivoConsultaSection>
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
            {planes_estudio ? (
              <PlanEstudioSection
                plan={planes_estudio}
                estudios_complementarios={
                  planes_estudio?.estudios_complementarios
                }
              />
            ) : (
              <p className="text-5 py-8 text-center text-zinc-400">
                Sin plan de estudio registrado.
              </p>
            )}
          </Tab.Panel>
        </div>
      </Tab>
    </div>
  )
}
