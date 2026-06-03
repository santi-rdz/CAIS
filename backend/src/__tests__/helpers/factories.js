function uniqueEmail(prefix) {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@test.com`
}

export function buildPasanteCreate(overrides = {}) {
  return {
    nombre: 'Test',
    apellidos: 'Pasante',
    correo: uniqueEmail('pasante'),
    fecha_nacimiento: '2000-01-01',
    telefono: '6861111111',
    rol: 'pasante',
    password: 'Abc12345!',
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
    password: 'Abc12345!',
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
    password: 'Abc12345!',
    confirmPassword: 'Abc12345!',
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
    password: 'Abc12345!',
    confirmPassword: 'Abc12345!',
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

export function buildEvolutionNote({ pacienteId }, overrides = {}) {
  return {
    paciente_id: pacienteId,
    creado_at: new Date().toISOString(),
    motivo_consulta: 'Dolor de cabeza',
    ant_gine_andro: 'Sin antecedentes',
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
