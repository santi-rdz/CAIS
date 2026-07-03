import {
  ALTERACIONES_URINARIAS_OPTIONS,
  LITOS_OPTIONS,
  CETONAS_OPTIONS,
} from '@features/patients/nutricion/constants'

// Config declarativa de cada sub-perfil de eval_bioq_nutricion: nombre de
// campo, label, hint (rango de referencia clínico) y, para selects, sus
// opciones. La usan tanto los steps del form (ProfileFieldsGrid) como la
// vista de detalle de solo-lectura (BioqProfileFields) — una sola fuente de
// verdad para labels/hints/opciones.

export const PERFIL_ANEMIA_FIELDS = [
  { name: 'eritrocitos', label: 'Eritrocitos', hint: '4-6 x10⁶/µL' },
  { name: 'hemoglobina', label: 'Hemoglobina', hint: '12-17 g/dL (Diálisis 11-12)' },
  { name: 'hematocrito', label: 'Hematocrito', hint: '37-47 %' },
  { name: 'vcm', label: 'VCM', hint: '83-100 fL' },
  { name: 'homocisteina', label: 'Homocisteína', hint: '5-15 mmol/L' },
  { name: 'ferritina', label: 'Ferritina', hint: 'H 24-336 / M 11-307 mcg/L' },
  { name: 'hierro', label: 'Hierro', hint: '50-212 mcg/dL' },
  { name: 'cap_fij_tot_he', label: 'Capacidad fijadora total', hint: '300-400 µg/dL' },
  { name: 'saturacion_hierro', label: '% Saturación de hierro', hint: '15-50 %' },
]

export const PERFIL_ENDOCRINO_FIELDS = [
  { name: 'glucosa', label: 'Glucosa', hint: 'NL: 70-100; Infl o SRA: >180 mg/dL' },
  { name: 'hbAlc', label: 'HbA1c', hint: '<6.0 %' },
  { name: 'insulina', label: 'Insulina', hint: '1.9-23 UI/mL' },
  { name: 'tiroxina_libre', label: 'Tiroxina libre', hint: '0.63-1.34 ng/dL' },
  { name: 'triyodotironina', label: 'Triyodotironina', hint: '0.64-1.81 ng/dL' },
]

export const PERFIL_RENAL_FIELDS = [
  { name: 'osmolaridad', label: 'Osmolaridad', hint: 'NL: 275-295; SH: >295' },
  { name: 'urea', label: 'Urea', hint: 'NL: 15-43; SH: >43' },
  { name: 'bun', label: 'BUN', hint: 'NL: 7-18; SH: >18' },
  { name: 'creatinina', label: 'Creatinina', hint: 'NL: 0.6-1.2; Diál >10' },
  { name: 'acido_urico', label: 'Ácido úrico', hint: 'F 1.5-7; M 2.5-8.5' },
  { name: 'sodio', label: 'Sodio', hint: 'NL: 135-145; SRA: >145' },
  { name: 'peso_sin_edema', label: 'Peso sin edema (kg)', hint: 'Peso sin retención de líquidos' },
  { name: 'agua', label: '% Agua corporal', hint: '>148 mmol/L, hiper Na, neuro' },
  { name: 'potasio', label: 'Potasio', hint: 'NL: 3.5-5.1; Diál 4.6-6.0; SRA >5.5' },
  { name: 'fosforo', label: 'Fósforo', hint: 'NL: 2.5-4.5; Diál 3.5-5.5; SRA >4.5' },
  { name: 'calcio_serico', label: 'Calcio sérico', hint: '8.5-10.2' },
  { name: 'ca_corregido', label: 'Calcio corregido', hint: '8.4-10.5' },
  { name: 'producto_caP', label: 'Producto Ca/P', hint: '<55' },
  { name: 'pth', label: 'PTH', hint: 'NL 82; Diálisis 150-300' },
  { name: 'vitamina_d', label: 'Vitamina D 25-OH', hint: 'Suf >30; Ins 20-29.9; Def <10-19.9' },
  { name: 'tfge', label: 'TFGe', hint: '>90' },
  { name: 'albuminuria', label: 'Albuminuria', hint: '<30' },
]

export const PERFIL_LIPIDOS_FIELDS = [
  { name: 'colesterol', label: 'Colesterol total', hint: '120-200' },
  { name: 'c_hdl', label: 'c-HDL', hint: '>40 (>50 ideal)' },
  { name: 'c_ldl', label: 'c-LDL', hint: '<150 (Diálisis <100)' },
  { name: 'trigliceridos', label: 'Triglicéridos', hint: '80-150' },
]

export const BALANCE_ACIDO_BASE_FIELDS = [
  { name: 'ph_serico', label: 'pH sérico', hint: '7.35-7.45', step: '0.01' },
  { name: 'saturacion_o2', label: 'Saturación O₂', hint: '>90 %' },
  { name: 'bicarbonato', label: 'Bicarbonato', hint: '22-26' },
  { name: 'pco2_total', label: 'pCO₂ total', hint: '35-45' },
]

export const PERFIL_ORINA_FIELDS = [
  { name: 'volumen_urinario', label: 'Volumen urinario (ml)', hint: '>1000' },
  { name: 'densidad', label: 'Densidad', hint: '1010-1020', step: '0.001' },
  {
    name: 'alteraciones_urinarias',
    label: 'Alteraciones urinarias',
    hint: 'Estado general de la orina',
    type: 'select',
    options: ALTERACIONES_URINARIAS_OPTIONS,
  },
  {
    name: 'litos',
    label: 'Litos',
    hint: 'Tipo de cálculos presentes',
    type: 'select',
    options: LITOS_OPTIONS,
  },
  { name: 'ph', label: 'pH urinario', hint: 'Ácido <5.5; alcalino >6.0', step: '0.01' },
  {
    name: 'cetonas',
    label: 'Cetonas',
    hint: 'Nivel de cetonas en orina',
    type: 'select',
    options: CETONAS_OPTIONS,
  },
  { name: 'sodio', label: 'Sodio urinario', hint: '40-220 mEq/día', step: '1' },
]

export const PERFIL_INFLAMATORIO_FIELDS = [
  { name: 'pcr', label: 'PCR', hint: '>0.8' },
  { name: 'plaquetas', label: 'Plaquetas', hint: '<150,000' },
]

export const EVAL_ESTADO_NUTRICION_FIELDS = [
  { name: 'leucocitos', label: 'Leucocitos', hint: 'NL: 5,000-10,000; Infl: <4,500 o >11,000' },
  { name: 'linfocitos', label: 'Linfocitos %', hint: '17-45' },
  { name: 'ctl', label: 'CTL', hint: '>1500' },
  { name: 'albumina', label: 'Albúmina', hint: '3.4-5.4; Diál >4.0; Infl <3.5' },
  { name: 'pre_albumina', label: 'Prealbúmina', hint: '>30; Infl <16' },
  { name: 'transferrina', label: 'Transferrina', hint: 'NL: >200; Infl: <200' },
]

// El mockup muestra perfil_inflamatorio + eval_estado_nutricion en un solo
// grid bajo un único heading — se combinan aquí con su prefix explícito para
// que ProfileFieldsGrid/BioqProfileFields no necesiten lógica especial.
export const PERFIL_INFLAMATORIO_Y_NUTRICION_FIELDS = [
  ...PERFIL_INFLAMATORIO_FIELDS.map((f) => ({ ...f, prefix: 'perfil_inflamatorio' })),
  ...EVAL_ESTADO_NUTRICION_FIELDS.map((f) => ({ ...f, prefix: 'eval_estado_nutricion' })),
]
