// Config declarativa del examen físico: única fuente de verdad de los campos de
// cada bloque, sus labels y (para semiología) el catálogo de cada select. La
// usan los steps del form y las vistas de detalle.

// Step 1 — Monitoreo de peso (peso_habitual / peso_perdido; % derivado).
export const PESO_FIELDS = [
  { name: 'peso_habitual', label: 'Peso habitual (kg)', placeholder: 'Ej: 70.5' },
  { name: 'peso_perdido', label: 'Peso perdido en últimos 3-6 meses (kg)', placeholder: 'Ej: 5.0' },
]

// Step 2 — Signos vitales (numéricos + un booleano).
export const SIGNOS_NUM_FIELDS = [
  { name: 'tas', label: 'TAS (mmHg)', placeholder: '120' },
  { name: 'tad', label: 'TAD (mmHg)', placeholder: '80' },
  { name: 'temperatura', label: 'Temperatura (°C)', placeholder: '36.5' },
]

// Step 3 — Indicadores antropométricos/físicos (todos escala de severidad 0-3).
// `name` = columna en eval_semiologia_nutricional; el label es el término
// clínico del examen (el orden sigue el del formato original).
export const ANTROPOMETRICO_FIELDS = [
  { name: 'pcb', label: 'PCB' },
  { name: 'pct', label: 'PCT' },
  { name: 'fondo_ojo', label: 'Fondoscopia' },
  { name: 'sienes', label: 'Sienes' },
  { name: 'clavicula', label: 'Clavícula' },
  { name: 'hombros', label: 'Hombros' },
  { name: 'omoplato', label: 'Escápula' },
  { name: 'interoseos_mano', label: 'Interóseos de la mano' },
  { name: 'costillas', label: 'Costillas' },
  { name: 'espalda_alta', label: 'Dorso superior' },
  { name: 'cuadriceps', label: 'Cuádriceps' },
  { name: 'pantorrilla', label: 'Pantorrilla' },
]

// Diagnósticos de reserva (cada uno con su propio catálogo → se resuelve en el
// componente por `type`).
export const DIAGNOSTICO_FIELDS = [
  {
    name: 'diag_reservagrasa',
    label: 'Evaluación de reserva grasa',
    type: 'severidad',
    hint: 'Evaluación consistente con otros campos semiológicos.',
  },
  {
    name: 'diag_reserva_muscular',
    label: 'Evaluación de reserva muscular',
    type: 'muscular',
    hint: 'Los rangos son referencias clínicas.',
  },
  { name: 'edema', label: 'Edema', type: 'edema' },
]
