// Catálogos de las distribuciones de pacientes (género, edad, procedencia).
// Fuente única para las gráficas del dashboard y los reportes de exportación,
// así la etiqueta en pantalla y en el PDF/Excel nunca se desincronizan.
export const GENDER_ITEMS = [
  { key: 'Masculino', label: 'Hombres', color: '#3b82f6' }, // Blue-500
  { key: 'Femenino', label: 'Mujeres', color: '#ec4899' }, // Pink-500
]

export const AGE_ITEMS = [
  { key: '< 18', label: '< 18 años', color: '#14b8a6' }, // Emerald-500
  { key: '18 - 59', label: '18 - 59 años', color: '#0ea5e9' }, // Teal-500
  { key: '>= 60', label: '>= 60 años', color: '#f59e0b' }, // Amber-500
]

export const PROCEDENCIA_ITEMS = [
  { key: 'interno', label: 'Internos (UABC)', color: '#6366f1' }, // Indigo-500
  { key: 'externo', label: 'Externos', color: '#f97316' }, // Orange-500
]

const toLabels = (items) => Object.fromEntries(items.map((i) => [i.key, i.label]))
export const GENDER_LABELS = toLabels(GENDER_ITEMS)
export const AGE_LABELS = toLabels(AGE_ITEMS)
export const PROCEDENCIA_LABELS = toLabels(PROCEDENCIA_ITEMS)
