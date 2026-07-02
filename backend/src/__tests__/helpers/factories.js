import { uniqueEmail } from './ids.js'
import { STRONG_TEST_PASSWORD } from './passwords.js'

export function buildPasanteCreate(overrides = {}) {
  return {
    nombre: 'Test',
    apellidos: 'Pasante',
    correo: uniqueEmail('pasante'),
    fecha_nacimiento: '2000-01-01',
    telefono: '6861111111',
    rol: 'pasante',
    password: STRONG_TEST_PASSWORD,
    matricula: 'TMAT01',
    servicio_inicio_anio: '2026',
    servicio_inicio_periodo: '1',
    servicio_fin_anio: '2026',
    servicio_fin_periodo: '2',
    area: 'MEDICINA',
    ...overrides,
  }
}

export function buildCoordCreate(overrides = {}) {
  return {
    nombre: 'Test',
    apellidos: 'Coord',
    correo: uniqueEmail('coord'),
    fecha_nacimiento: '1990-01-01',
    telefono: '6862222222',
    rol: 'coordinador',
    password: STRONG_TEST_PASSWORD,
    cedula: 'TCED01',
    area: 'MEDICINA',
    ...overrides,
  }
}

export function buildPasanteSignup({ token }, overrides = {}) {
  return {
    token,
    nombre: 'Reg',
    apellidos: 'Pasante',
    fecha_nacimiento: '2000-01-01',
    telefono: '6861111111',
    password: STRONG_TEST_PASSWORD,
    confirmPassword: STRONG_TEST_PASSWORD,
    matricula: 'RMAT01',
    servicio_inicio_anio: '2026',
    servicio_inicio_periodo: '1',
    servicio_fin_anio: '2026',
    servicio_fin_periodo: '2',
    ...overrides,
  }
}

export function buildCoordSignup({ token }, overrides = {}) {
  return {
    token,
    nombre: 'Reg',
    apellidos: 'Coord',
    fecha_nacimiento: '1990-01-01',
    telefono: '6862222222',
    password: STRONG_TEST_PASSWORD,
    confirmPassword: STRONG_TEST_PASSWORD,
    cedula: 'RCED01',
    ...overrides,
  }
}

export function buildEmergency(overrides = {}) {
  return {
    fecha_hora: new Date().toISOString(),
    ubicacion: 'Laboratorio de prueba',
    recurrente: false,
    ...overrides,
  }
}

export function buildEvolutionNote({ historiaMedicaId }, overrides = {}) {
  return {
    historia_medica_id: historiaMedicaId,
    creado_at: new Date().toISOString(),
    motivo_consulta: 'Dolor de cabeza',
    ant_gine_andro: 'Sin antecedentes',
    ...overrides,
  }
}

export function buildNutritionalEvalMinimal({ historiaPacienteId }, overrides = {}) {
  return {
    historia_paciente_id: historiaPacienteId,
    sigue_dieta: false,
    tiene_alergia: false,
    cual_alergia: null,
    alimentos_disgusta: 'Brócoli',
    ...overrides,
  }
}

export function buildNutritionalEvalCompleto({ historiaPacienteId }, overrides = {}) {
  return {
    ...buildNutritionalEvalMinimal({ historiaPacienteId }),
    eval_apetito_nutricion: {
      apetito: 'Normal',
      lleno: 'Rápido',
      sabor_comida: 'Bueno',
      comidas_al_dia: '3',
      puntaje_total: 10,
      clasif_alteracion_apetito: 'Sin alteración',
    },
    frec_consumo_alimentos_nutricion: {
      frutas: 'Diario',
      verduras_cocidas: 'Semanal',
      verduras_crudas: 'Diario',
      pescado: 'Quincenal',
      mariscos: 'Mensual',
      pollo: 'Semanal',
      carne_roja: 'Semanal',
      quesos: 'Semanal',
      huevo_entero: 'Diario',
      clara_huevo: 'Nunca',
      embutidos: 'Nunca',
      leguminosas: 'Semanal',
      tortilla_maiz: 'Diario',
      cant_tortilla_maiz: '3',
      tortilla_harina: 'Nunca',
      cant_tortilla_harina: '0',
      pan_de_caja: 'Nunca',
      galletas_industr: 'Nunca',
      pan_dulce: 'Semanal',
      cereal_de_caja: 'Nunca',
      frituras_papas: 'Nunca',
      birote_bolillo: 'Semanal',
      pastas_arroz: 'Semanal',
      aderezos_capsu: 'Nunca',
      comida_rapida: 'Mensual',
      grasa_animal: 'Nunca',
      grasa_vegetal: 'Diario',
      cafe_te: 'Diario',
      litros_al_dia_cafe_te: '1',
      bebida_az: 'Nunca',
      litros_al_dia_beb_az: '0',
      bebida_endul_art: 'Nunca',
      litros_al_dia_beb_endul: '0',
      leche_sin_az: 'Diario',
      litros_al_dia_leche_sin_az: '0.5',
      agua_simple: 'Diario',
      litros_al_dia_agua_simple: '2',
      agrega_sal_extra: 'No',
      cdas_al_dia_sal_extra: 0,
      agrega_azucar: 'No',
      cdas_sobres_al_dia_azucar: 0,
    },
    horarios_comida_nutricion: {
      hora_desayuno: '08:00',
      hora_comida: '14:00',
      hora_cena: '20:00',
      hora_colac_1: '11:00',
      hora_colac_2: '17:00',
      hora_colac_3: null,
      hora_despierto: '07:00',
      tipo_alimentacion: 'Omnívora',
      problemas_masticar: false,
      problemas_pasar_alimento: false,
      perdida_dientes: false,
      pensamientos_sobre_dieta: 'Me cuesta evitar el pan dulce',
    },
    ...overrides,
  }
}

export function buildMedicalHistory({ pacienteId, usuarioId }, overrides = {}) {
  return {
    paciente_id: pacienteId,
    tipo_sangre: 'O+',
    vacunas_infancia_completas: true,
    motivo_consulta: 'Consulta de prueba',
    historia_enfermedad_actual: 'Sin antecedentes relevantes',
    antecedentes_familiares: { padre: 'Hipertensión' },
    antecedentes_patologicos: { cronico_degenerativos: 'Ninguno' },
    antecedentes_no_patologicos: {
      alimentacion_adecuada: true,
      calidad_cantidad_alimentacion: 'Adecuada',
      higiene_adecuada: 'Adecuada',
      inmunizaciones_completas: true,
      zoonosis: false,
      tipo_zoonosis: 'Ninguna',
    },
    aparatos_sistemas: { neurologico: 'Normal' },
    informacion_fisica: {
      peso: 70,
      altura: 1.75,
      pa_sistolica: 120,
      pa_diastolica: 80,
      fc: 72,
      fr: 16,
      circ_cintura: 85,
      circ_cadera: 95,
      sp_o2: 98,
      glucosa_capilar: 90,
      temperatura: 36.6,
    },
    inmunizaciones: {},
    planes_estudio: { usuario_id: usuarioId },
    servicios: { agua: true },
    ...overrides,
  }
}
