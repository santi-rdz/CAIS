import { useState } from 'react'
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineBeaker,
} from 'react-icons/hi2'
import Heading from '@components/Heading'
import { formatFechaLong } from '@lib/dateHelpers'

// ─── Static mock data ────────────────────────────────────────────────────────

const HISTORIAS = {
  '2026-2031': {
    tipo_sangre: 'O+',
    vacunas_infancia_completas: true,
    motivo_consulta:
      'Consulta de control semestral. Paciente refiere cefalea frecuente de predominio vespertino.',
    historia_enfermedad_actual:
      'Paciente de 22 años que acude por cefalea de 2 semanas de evolución, de características tensionales, EVA 6/10, sin irradiación, sin náusea ni fotofobia.',
    informacion_fisica: {
      peso: 72.5,
      altura: 1.75,
      pa_sistolica: 118,
      pa_diastolica: 78,
      fc: 72,
      fr: 16,
      circ_cintura: 84.0,
      circ_cadera: 96.0,
      sp_o2: 98.5,
      glucosa_capilar: 94.0,
      temperatura: 36.7,
      exploracion_fisica:
        'Paciente consciente, orientado en tiempo, lugar y persona. Bien hidratado, con adecuado estado general.',
      habito_exterior:
        'Buen estado general, cooperador, sin fascies de dolor en reposo.',
    },
    antecedentes_patologicos: {
      cronico_degenerativos: 'Niega',
      quirurgicos: 'Apendicectomía a los 15 años, sin complicaciones.',
      hospitalizaciones: 'Niega',
      traumaticos: 'Fractura de radio derecho a los 10 años, consolidada.',
      transfusionales: 'Niega',
      transplantes: null,
      alergicos: 'Penicilina (urticaria generalizada)',
      infectocontagiosos: 'Varicela en la infancia.',
      toxicomanias: null,
      covid_19: 'COVID-19 en 2021, evolución leve, sin secuelas.',
      psicologia_psiquiatria: null,
      gyo: null,
      enfermedades_congenitas: null,
      enfermedades_infancia: 'Varicela, sarampión.',
    },
    antecedentes_familiares: {
      padre: 'Hipertensión arterial sistémica, Diabetes mellitus tipo 2',
      madre: 'Hipotiroidismo',
      abuelo_paterno: 'Cardiopatía isquémica',
      abuelo_materno: 'Niega',
      abuela_paterna: 'Diabetes mellitus tipo 2',
      abuela_materna: null,
      otros: null,
    },
    aparatos_sistemas: {
      neurologico: 'Cefalea tensional frecuente.',
      cardiovascular: 'Sin alteraciones referidas.',
      respiratorio: 'Sin alteraciones referidas.',
      hematologico: null,
      digestivo: 'Reflujo gastroesofágico ocasional.',
      musculoesqueletico: null,
      genitourinario: null,
      endocrinologico: null,
      metabolico: null,
      nutricional: null,
    },
    inmunizaciones: {
      influenza: '2025-10-15',
      tetanos: '2022-03-20',
      hepatitis_b: '2018-06-10',
      covid_19: '2021-07-15',
      otros: null,
    },
    planes_estudio: {
      codigo_cie10: 'G44.2',
      plan_tratamiento:
        'Paracetamol 500 mg c/8h por 5 días. Control en 2 semanas si persiste.',
      tratamiento:
        'Analgesia, reposo relativo, hidratación adecuada. Evitar pantallas prolongadas.',
    },
    servicios: {
      gas: true,
      luz: true,
      agua: true,
      drenaje: true,
      cable_tel: false,
      internet: true,
    },
  },
  '2021-2026': {
    tipo_sangre: 'O+',
    vacunas_infancia_completas: true,
    motivo_consulta: 'Revisión anual. Paciente sin quejas activas.',
    historia_enfermedad_actual:
      'Paciente acude a revisión de rutina, sin síntomas activos relevantes.',
    informacion_fisica: {
      peso: 70.0,
      altura: 1.75,
      pa_sistolica: 115,
      pa_diastolica: 75,
      fc: 68,
      fr: 15,
      circ_cintura: 82.0,
      circ_cadera: 94.0,
      sp_o2: 99.0,
      glucosa_capilar: 90.0,
      temperatura: 36.5,
      exploracion_fisica: 'Sin hallazgos patológicos.',
      habito_exterior: 'Buen estado general.',
    },
    antecedentes_patologicos: {
      cronico_degenerativos: 'Niega',
      quirurgicos: 'Apendicectomía a los 15 años.',
      hospitalizaciones: 'Niega',
      traumaticos: 'Fractura de radio derecho a los 10 años.',
      transfusionales: 'Niega',
      transplantes: null,
      alergicos: 'Penicilina',
      infectocontagiosos: 'Varicela en la infancia.',
      toxicomanias: null,
      covid_19: null,
      psicologia_psiquiatria: null,
      gyo: null,
      enfermedades_congenitas: null,
      enfermedades_infancia: 'Varicela, sarampión.',
    },
    antecedentes_familiares: {
      padre: 'Hipertensión arterial sistémica',
      madre: 'Hipotiroidismo',
      abuelo_paterno: null,
      abuelo_materno: 'Niega',
      abuela_paterna: 'Diabetes mellitus tipo 2',
      abuela_materna: null,
      otros: null,
    },
    aparatos_sistemas: {
      neurologico: null,
      cardiovascular: 'Sin alteraciones.',
      respiratorio: 'Sin alteraciones.',
      hematologico: null,
      digestivo: null,
      musculoesqueletico: null,
      genitourinario: null,
      endocrinologico: null,
      metabolico: null,
      nutricional: null,
    },
    inmunizaciones: {
      influenza: '2021-11-02',
      tetanos: '2019-05-14',
      hepatitis_b: '2018-06-10',
      covid_19: null,
      otros: null,
    },
    planes_estudio: null,
    servicios: {
      gas: true,
      luz: true,
      agua: true,
      drenaje: true,
      cable_tel: false,
      internet: false,
    },
  },
}

const PERIODOS = [
  { value: '2026-2031', label: '2026–2031 (actual)' },
  { value: '2021-2026', label: '2021–2026' },
  { value: '2016-2021', label: '2016–2021' },
]

const SECCIONES = [
  { id: 'consulta', label: 'Consulta' },
  { id: 'signos', label: 'Signos vitales' },
  { id: 'ant-patologicos', label: 'Ant. patológicos' },
  { id: 'ant-familiares', label: 'Ant. familiares' },
  { id: 'aparatos', label: 'Aparatos y sistemas' },
  { id: 'inmunizaciones', label: 'Inmunizaciones' },
  { id: 'plan', label: 'Plan de estudio' },
  { id: 'servicios', label: 'Servicios' },
]

// ─── Main component ──────────────────────────────────────────────────────────

export default function PatientHistoria() {
  const [periodo, setPeriodo] = useState('2026-2031')
  const [seccion, setSeccion] = useState('consulta')
  const historia = HISTORIAS[periodo] ?? null

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header: title + period selector */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <Heading as="h3">Historia médica</Heading>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="text-5 cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-zinc-700 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
        >
          {PERIODOS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Horizontal section nav */}
      <div className="overflow-x-auto border-b border-gray-100">
        <nav className="flex min-w-max px-5">
          {SECCIONES.map((s) => {
            const isActive = seccion === s.id
            return (
              <button
                key={s.id}
                onClick={() => setSeccion(s.id)}
                className={`text-5 cursor-pointer whitespace-nowrap border-b-2 px-4 py-3 font-medium transition-colors duration-150 ${
                  isActive
                    ? 'border-green-700 text-green-800'
                    : 'border-transparent text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Section content */}
      <div className="p-5">
        {!historia ? (
          <p className="text-5 py-8 text-center text-zinc-400">
            Sin historia médica registrada para este periodo.
          </p>
        ) : (
          <SectionContent seccion={seccion} historia={historia} />
        )}
      </div>
    </div>
  )
}

function SectionContent({ seccion, historia }) {
  switch (seccion) {
    case 'consulta':
      return <ConsultaSection historia={historia} />
    case 'signos':
      return <SignosVitalesSection info={historia.informacion_fisica} />
    case 'ant-patologicos':
      return <AntecedentesPatologicosSection ap={historia.antecedentes_patologicos} />
    case 'ant-familiares':
      return <AntecedentesFamiliaresSection af={historia.antecedentes_familiares} />
    case 'aparatos':
      return <AparatosSistemasSection as_={historia.aparatos_sistemas} />
    case 'inmunizaciones':
      return <InmunizacionesSection inm={historia.inmunizaciones} />
    case 'plan':
      return <PlanEstudioSection plan={historia.planes_estudio} />
    case 'servicios':
      return <ServiciosSection servicios={historia.servicios} />
    default:
      return null
  }
}

// ─── Sections ────────────────────────────────────────────────────────────────

function ConsultaSection({ historia }) {
  const { tipo_sangre, vacunas_infancia_completas, motivo_consulta, historia_enfermedad_actual } = historia

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tipo_sangre && (
          <span className="text-6 inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 font-medium text-red-700">
            <HiOutlineBeaker size={12} />
            Tipo de sangre: {tipo_sangre}
          </span>
        )}
        <span className={`text-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium ${vacunas_infancia_completas ? 'border-green-100 bg-green-50 text-green-700' : 'border-zinc-200 bg-zinc-100 text-zinc-500'}`}>
          {vacunas_infancia_completas
            ? <HiOutlineCheckCircle size={12} />
            : <HiOutlineXCircle size={12} />}
          Vacunas {vacunas_infancia_completas ? 'completas' : 'incompletas'}
        </span>
      </div>
      <DataField label="Motivo de consulta" value={motivo_consulta} multiline />
      <DataField label="Historia de enfermedad actual" value={historia_enfermedad_actual} multiline />
    </div>
  )
}

function SignosVitalesSection({ info }) {
  if (!info) return <Empty />

  const imc = info.peso && info.altura
    ? (info.peso / (info.altura * info.altura)).toFixed(1)
    : null

  const pa = info.pa_sistolica && info.pa_diastolica
    ? `${info.pa_sistolica}/${info.pa_diastolica}`
    : null

  return (
    <div className="space-y-6">
      <VitalGroup label="Hemodinámica">
        <VitalStat label="Presión arterial" value={pa} unit="mmHg" />
        <VitalStat label="Frec. cardíaca" value={info.fc} unit="lpm" />
      </VitalGroup>
      <VitalGroup label="Respiratoria">
        <VitalStat label="Frec. respiratoria" value={info.fr} unit="rpm" />
        <VitalStat label="SpO₂" value={info.sp_o2} unit="%" />
        <VitalStat label="Temperatura" value={info.temperatura} unit="°C" />
      </VitalGroup>
      <VitalGroup label="Antropométrica">
        <VitalStat label="Peso" value={info.peso} unit="kg" />
        <VitalStat label="Altura" value={info.altura ? `${info.altura} m` : null} unit="" />
        <VitalStat label="IMC" value={imc} unit="kg/m²" />
        <VitalStat label="Glucosa" value={info.glucosa_capilar} unit="mg/dL" />
        <VitalStat label="Circ. cintura" value={info.circ_cintura} unit="cm" />
        <VitalStat label="Circ. cadera" value={info.circ_cadera} unit="cm" />
      </VitalGroup>
      {(info.exploracion_fisica || info.habito_exterior) && (
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <DataField label="Exploración física" value={info.exploracion_fisica} multiline />
          <DataField label="Hábito exterior" value={info.habito_exterior} multiline />
        </div>
      )}
    </div>
  )
}

function AntecedentesPatologicosSection({ ap }) {
  if (!ap) return <Empty />

  const fields = [
    { label: 'Crónico-degenerativos', value: ap.cronico_degenerativos },
    { label: 'Quirúrgicos', value: ap.quirurgicos },
    { label: 'Hospitalizaciones', value: ap.hospitalizaciones },
    { label: 'Traumáticos', value: ap.traumaticos },
    { label: 'Transfusionales', value: ap.transfusionales },
    { label: 'Trasplantes', value: ap.transplantes },
    { label: 'Alérgicos', value: ap.alergicos },
    { label: 'Infectocontagiosos', value: ap.infectocontagiosos },
    { label: 'Toxicomanías', value: ap.toxicomanias },
    { label: 'COVID-19', value: ap.covid_19 },
    { label: 'Psicología / Psiquiatría', value: ap.psicologia_psiquiatria },
    { label: 'GYO', value: ap.gyo },
    { label: 'Enfs. congénitas', value: ap.enfermedades_congenitas },
    { label: 'Enfs. de la infancia', value: ap.enfermedades_infancia },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <DataField key={f.label} label={f.label} value={f.value} multiline />
      ))}
    </div>
  )
}

function AntecedentesFamiliaresSection({ af }) {
  if (!af) return <Empty />

  const fields = [
    { label: 'Padre', value: af.padre },
    { label: 'Madre', value: af.madre },
    { label: 'Abuelo paterno', value: af.abuelo_paterno },
    { label: 'Abuelo materno', value: af.abuelo_materno },
    { label: 'Abuela paterna', value: af.abuela_paterna },
    { label: 'Abuela materna', value: af.abuela_materna },
    { label: 'Otros', value: af.otros },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <DataField key={f.label} label={f.label} value={f.value} multiline />
      ))}
    </div>
  )
}

function AparatosSistemasSection({ as_ }) {
  if (!as_) return <Empty />

  const fields = [
    { label: 'Neurológico', value: as_.neurologico },
    { label: 'Cardiovascular', value: as_.cardiovascular },
    { label: 'Respiratorio', value: as_.respiratorio },
    { label: 'Hematológico', value: as_.hematologico },
    { label: 'Digestivo', value: as_.digestivo },
    { label: 'Musculoesquelético', value: as_.musculoesqueletico },
    { label: 'Genitourinario', value: as_.genitourinario },
    { label: 'Endocrinológico', value: as_.endocrinologico },
    { label: 'Metabólico', value: as_.metabolico },
    { label: 'Nutricional', value: as_.nutricional },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <DataField key={f.label} label={f.label} value={f.value} multiline />
      ))}
    </div>
  )
}

function InmunizacionesSection({ inm }) {
  if (!inm) return <Empty />

  const vaccines = [
    { label: 'Influenza', value: inm.influenza },
    { label: 'Tétanos', value: inm.tetanos },
    { label: 'Hepatitis B', value: inm.hepatitis_b },
    { label: 'COVID-19', value: inm.covid_19 },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {vaccines.map((v) => (
          <div
            key={v.label}
            className={`rounded-lg border p-3 ${v.value ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'}`}
          >
            <p className="text-6 font-medium text-zinc-400">{v.label}</p>
            {v.value ? (
              <>
                <HiOutlineCheckCircle size={14} className="mt-1 text-green-600" />
                <p className="text-6 mt-0.5 text-zinc-600">{formatFechaLong(v.value)}</p>
              </>
            ) : (
              <p className="text-6 mt-1 text-zinc-300">No registrada</p>
            )}
          </div>
        ))}
      </div>
      {inm.otros && (
        <DataField label="Otras inmunizaciones" value={inm.otros} multiline />
      )}
    </div>
  )
}

function PlanEstudioSection({ plan }) {
  if (!plan) return <Empty message="Sin plan de estudio registrado." />

  return (
    <div className="space-y-5">
      <div>
        <span className="text-6 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-medium text-blue-700">
          CIE-10: {plan.codigo_cie10}
        </span>
      </div>
      <DataField label="Plan de tratamiento" value={plan.plan_tratamiento} multiline />
      <DataField label="Tratamiento" value={plan.tratamiento} multiline />
    </div>
  )
}

function ServiciosSection({ servicios }) {
  if (!servicios) return <Empty />

  const items = [
    { label: 'Gas', value: servicios.gas },
    { label: 'Luz', value: servicios.luz },
    { label: 'Agua', value: servicios.agua },
    { label: 'Drenaje', value: servicios.drenaje },
    { label: 'Cable / Teléfono', value: servicios.cable_tel },
    { label: 'Internet', value: servicios.internet },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span
          key={s.label}
          className={`text-5 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-medium ${s.value ? 'border-green-100 bg-green-50 text-green-700' : 'border-zinc-200 bg-zinc-100 text-zinc-400'}`}
        >
          {s.value ? <HiOutlineCheckCircle size={14} /> : <HiOutlineXCircle size={14} />}
          {s.label}
        </span>
      ))}
    </div>
  )
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function VitalGroup({ label, children }) {
  return (
    <div>
      <p className="text-6 mb-2 font-medium uppercase tracking-widest text-zinc-300">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{children}</div>
    </div>
  )
}

function VitalStat({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-6 font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="text-3 mt-1 font-lato font-semibold text-zinc-800">
        {value != null ? (
          <>
            {value}
            {unit && <span className="text-6 ml-1 font-normal text-zinc-400">{unit}</span>}
          </>
        ) : (
          <span className="text-5 font-normal text-zinc-300">—</span>
        )}
      </p>
    </div>
  )
}

function DataField({ label, value, multiline = false }) {
  return (
    <div className="space-y-1">
      <p className="text-6 font-medium text-zinc-400">{label}</p>
      <p className={`text-5 text-zinc-800 ${multiline ? 'whitespace-pre-wrap' : ''}`}>
        {value ?? <span className="text-zinc-300">—</span>}
      </p>
    </div>
  )
}

function Empty({ message = 'Sin información registrada.' }) {
  return (
    <p className="text-5 py-6 text-center text-zinc-400">{message}</p>
  )
}
