import pkg from '@prisma/client'
const { PrismaClient } = pkg

import { randomUUID } from 'node:crypto'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import bcrypt from 'bcryptjs'

// ── Prisma client (standalone, no depende de app) ──────────────────
const url = new URL(process.env.DATABASE_URL)
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  allowPublicKeyRetrieval: true,
})
const prisma = new PrismaClient({ adapter })

// ── Helpers UUID ↔ Buffer ──────────────────────────────────────────
const uuidToBuf = (uuid) => Buffer.from(uuid.replace(/-/g, ''), 'hex')
const newId = () => uuidToBuf(randomUUID())

// ── Password compartido para usuarios de prueba ───────────────────
const SEED_PASSWORD = '123'

// ── UUIDs fijos para historias y notas (igual que en CAISchema.sql) ─
const HM_IDS = {
  carlos: '550e8400-e29b-41d4-a716-446655440000',
  ana: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  jorge: '7ca8b911-0ebe-22e2-91c5-11d505641c29',
  lucia: '8db9ca22-1fcf-33f3-a2d6-22e616752d30',
}

const NE_IDS = {
  ne1: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  ne2: '6ba7b811-9dad-11d1-80b4-00c04fd430c9',
  ne3: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  ne4: 'c1fed0aa-0adc-4483-b678-7cca71863e42',
  ne5: 'd2aebbaa-1bed-5594-a789-8ddb82974f53',
}

async function main() {
  if ((await prisma.usuarios.count()) > 0) {
    console.log('Seed skipped: ya existen usuarios en la DB.')
    return
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12)

  // ═══════════════════════════════════════════
  // 1. CATÁLOGOS BASE
  // ═══════════════════════════════════════════
  const estadosData = ['ACTIVO', 'PENDIENTE', 'INACTIVO']
  const rolesData = ['PASANTE', 'COORDINADOR', 'ADMIN']
  const areasData = ['MEDICINA', 'NUTRICION']
  const accionesData = ['CREAR', 'ACTUALIZAR', 'ELIMINAR', 'INICIAR_SESION']
  const entidadesData = [
    'NOTA_EVOLUCION',
    'EXAMINACION_FISICA',
    'TPAN',
    'REC_24H',
    'EVAL_ANTROPOMETRICA',
    'HISTORIA_MEDICA',
    'PACIENTE',
    'USUARIO',
    'EMERGENCIA',
    'HISTORIA_NUTRICION',
    'EVAL_BIOQ_NUTRICION',
    'EVAL_NUTRICIONAL',
    'EVAL_ACT_FISICA_NUTRICION',
    'EVAL_CAL_SUENO',
  ]

  for (const codigo of estadosData) {
    await prisma.estados.upsert({
      where: { codigo },
      update: {},
      create: { codigo },
    })
  }
  for (const codigo of rolesData) {
    await prisma.roles.upsert({
      where: { codigo },
      update: {},
      create: { codigo },
    })
  }
  for (const nombre of areasData) {
    await prisma.areas.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    })
  }
  for (const codigo of accionesData) {
    await prisma.acciones.upsert({
      where: { codigo },
      update: {},
      create: { codigo },
    })
  }
  for (const nombre of entidadesData) {
    await prisma.entidades.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    })
  }

  console.log('✓ Catálogos base insertados')

  // ═══════════════════════════════════════════
  // 2. USUARIOS DE PRUEBA
  // ═══════════════════════════════════════════
  const usuariosData = [
    {
      nombre: 'Carlos',
      apellidos: 'Herrera',
      fecha_nacimiento: new Date('1980-04-12'),
      correo: 'carlos.herrera@cais.com',
      telefono: '6861000001',
      password_hash: passwordHash,
      estado_id: 1,
      rol_id: 1,
      area_id: 1,
      foto: 'https://randomuser.me/api/portraits/men/45.jpg',
      matricula: 'MED001',
      cedula: 'CED-MED-001',
      inicio_servicio: '08:00',
      fin_servicio: '16:00',
      ultimo_acceso: new Date('2026-03-09T14:00:00'),
    },
    {
      nombre: 'Sofia',
      apellidos: 'Navarro',
      fecha_nacimiento: new Date('1992-03-10'),
      correo: 'sofia.navarro@uabc.edu.mx',
      telefono: '6861000002',
      password_hash: passwordHash,
      estado_id: 1,
      rol_id: 2,
      area_id: 1,
      foto: 'https://randomuser.me/api/portraits/women/44.jpg',
      matricula: 'MED002',
      inicio_servicio: '09:00',
      fin_servicio: '15:00',
      ultimo_acceso: new Date('2026-03-09T13:30:00'),
    },
    {
      nombre: 'Luis',
      apellidos: 'Mendoza',
      fecha_nacimiento: new Date('1998-07-25'),
      correo: 'luis.mendoza@uabc.edu.mx',
      telefono: '6861000003',
      password_hash: passwordHash,
      estado_id: 3,
      rol_id: 1,
      area_id: 2,
      foto: 'https://randomuser.me/api/portraits/men/32.jpg',
      matricula: 'NUT001',
      inicio_servicio: '10:00',
      fin_servicio: '14:00',
      ultimo_acceso: new Date('2026-03-10T11:15:00'),
    },
    {
      nombre: 'Ana',
      apellidos: 'Torres',
      fecha_nacimiento: new Date('1999-11-20'),
      correo: 'ana.torres@uabc.edu.mx',
      telefono: '6861000004',
      password_hash: passwordHash,
      estado_id: 1,
      rol_id: 1,
      area_id: 2,
      foto: 'https://randomuser.me/api/portraits/women/65.jpg',
      matricula: 'NUT002',
      inicio_servicio: '07:00',
      fin_servicio: '13:00',
      ultimo_acceso: new Date('2026-03-11T08:45:00'),
    },
    {
      nombre: 'María',
      apellidos: 'López Vega',
      fecha_nacimiento: new Date('1988-09-15'),
      correo: 'maria.lopez@uabc.edu.mx',
      telefono: '6861000005',
      password_hash: passwordHash,
      estado_id: 1,
      rol_id: 2,
      area_id: 2,
      foto: 'https://randomuser.me/api/portraits/women/52.jpg',
      matricula: 'NUT003',
      cedula: 'CED-NUT-001',
      inicio_servicio: '08:00',
      fin_servicio: '16:00',
      ultimo_acceso: new Date('2026-03-10T09:00:00'),
    },
    {
      nombre: 'Roberto',
      apellidos: 'Díaz Morales',
      fecha_nacimiento: new Date('1975-01-20'),
      correo: 'admin@cais.com',
      telefono: '6861000006',
      password_hash: passwordHash,
      estado_id: 1,
      rol_id: 3,
      area_id: null,
      foto: 'https://randomuser.me/api/portraits/men/60.jpg',
      matricula: null,
      inicio_servicio: null,
      fin_servicio: null,
      ultimo_acceso: new Date('2026-03-12T08:00:00'),
    },
  ]

  for (const u of usuariosData) {
    const existing = await prisma.usuarios.findUnique({
      where: { correo: u.correo },
    })
    if (!existing) {
      await prisma.usuarios.create({ data: { id: newId(), ...u } })
    }
  }

  console.log('✓ Usuarios insertados')

  // helpers para obtener IDs de usuarios por correo
  const getUsuarioId = async (correo) => {
    const u = await prisma.usuarios.findUnique({ where: { correo } })
    return u.id
  }

  const carlosId = await getUsuarioId('carlos.herrera@cais.com')
  const sofiaId = await getUsuarioId('sofia.navarro@uabc.edu.mx')
  const luisId = await getUsuarioId('luis.mendoza@uabc.edu.mx')

  // ═══════════════════════════════════════════
  // 3. INVITACIONES DE REGISTRO
  // ═══════════════════════════════════════════
  const invitacionesData = [
    {
      correo: 'pasante.prueba@uabc.edu.mx',
      rol_id: 1,
      usado: false,
      expira_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      creado_por: carlosId,
    },
    {
      correo: 'coord.prueba@uabc.edu.mx',
      rol_id: 2,
      usado: false,
      expira_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      creado_por: carlosId,
    },
    {
      correo: 'pasante.expirado@uabc.edu.mx',
      rol_id: 1,
      usado: false,
      expira_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      creado_por: carlosId,
    },
    {
      correo: 'pasante.usado@uabc.edu.mx',
      rol_id: 1,
      usado: true,
      expira_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      creado_por: carlosId,
    },
  ]

  for (const inv of invitacionesData) {
    const existing = await prisma.invitaciones_registro.findUnique({
      where: { correo: inv.correo },
    })
    if (!existing) {
      await prisma.invitaciones_registro.create({
        data: { token: newId(), ...inv },
      })
    }
  }

  console.log('✓ Invitaciones insertadas')

  // ═══════════════════════════════════════════
  // 4. BITÁCORA DE EMERGENCIAS
  // ═══════════════════════════════════════════
  const emergenciasData = [
    {
      usuario_id: sofiaId,
      fecha_hora: new Date('2026-03-09T10:30:00'),
      ubicacion: 'Sala de Emergencias',
      nombre: 'Juan Pérez',
      matricula: 'MAT123456',
      telefono: '6641234567',
      diagnostico: 'Lipotimia',
      accion_realizada: 'Evaluación inmediata',
      tratamiento_admin: 'Hidratación IV',
      recurrente: false,
    },
    {
      usuario_id: carlosId,
      fecha_hora: new Date('2026-03-09T14:15:00'),
      ubicacion: 'Área de Triage',
      nombre: 'María López',
      matricula: 'MAT654321',
      telefono: '6645551234',
      diagnostico: 'Dolor torácico',
      accion_realizada: 'Monitoreo cardíaco',
      tratamiento_admin: 'EKG + Aspirina',
      recurrente: false,
    },
    {
      usuario_id: sofiaId,
      fecha_hora: new Date('2026-03-08T22:45:00'),
      ubicacion: 'Pasillo de Urgencias',
      nombre: 'Carlos Rodríguez',
      matricula: 'MAT789012',
      telefono: '6649876543',
      diagnostico: 'Crisis asmática',
      accion_realizada: 'Aplicación de salbutamol',
      tratamiento_admin: 'Nebulización + Corticoides',
      recurrente: true,
    },
    {
      usuario_id: luisId,
      fecha_hora: new Date('2026-03-07T16:20:00'),
      ubicacion: 'Cuarto de Observación',
      nombre: 'Ana García',
      matricula: 'MAT345678',
      telefono: '6642223333',
      diagnostico: 'Hipoglucemia',
      accion_realizada: 'Medición de glucosa',
      tratamiento_admin: 'Glucosa IV',
      recurrente: true,
    },
  ]

  // Solo insertar si no hay emergencias aún
  const emergenciasCount = await prisma.bitacora_emergencias.count()
  if (emergenciasCount === 0) {
    for (const e of emergenciasData) {
      await prisma.bitacora_emergencias.create({
        data: { id: newId(), ...e },
      })
    }
  }

  console.log('✓ Bitácora de emergencias insertada')

  // ═══════════════════════════════════════════
  // 5. PACIENTES
  // ═══════════════════════════════════════════
  const pacientesData = [
    {
      doctor_id: sofiaId,
      nombre: 'Carlos',
      apellidos: 'Mendoza Ruiz',
      fecha_nacimiento: new Date('1985-03-14'),
      es_externo: false,
      correo: 'carlos.mendoza@gmail.com',
      telefono: '6642345678',
      genero: 'Masculino',
      domicilio: 'Av. Revolución 456, Tijuana, BC',
      ocupacion: 'Contador',
      estado_civil: 'Casado',
      nivel_educativo: 'Licenciatura',
      religion: 'Católica',
      nss: '45678912301',
      curp_matricula: null,
      contacto_emergencia: 'Laura Ruiz Pérez',
      telefono_emergencia: '6641112233',
      parentesco_emergencia: 'Esposa',
      actualizado_at: new Date('2026-03-12T10:30:00'),
    },
    {
      doctor_id: sofiaId,
      nombre: 'Ana',
      apellidos: 'Fernández Torres',
      fecha_nacimiento: new Date('1992-07-22'),
      es_externo: false,
      correo: 'ana.fernandez@hotmail.com',
      telefono: '6643456789',
      genero: 'Femenino',
      domicilio: 'Calle Quinta 89, Tijuana, BC',
      ocupacion: 'Maestra',
      estado_civil: 'Soltera',
      nivel_educativo: 'Maestría',
      religion: 'Cristiana',
      nss: '78912345602',
      curp_matricula: null,
      contacto_emergencia: 'Pedro Fernández López',
      telefono_emergencia: '6642223344',
      parentesco_emergencia: 'Padre',
      actualizado_at: new Date('2026-03-10T09:15:00'),
    },
    {
      doctor_id: sofiaId,
      nombre: 'Jorge',
      apellidos: 'Reyes Castillo',
      fecha_nacimiento: new Date('1978-11-05'),
      es_externo: true,
      correo: 'jorge.reyes@yahoo.com',
      telefono: '6644567890',
      genero: 'Masculino',
      domicilio: 'Blvd. Agua Caliente 321, Tijuana, BC',
      ocupacion: 'Médico',
      estado_civil: 'Divorciado',
      nivel_educativo: 'Doctorado',
      religion: 'Ninguna',
      nss: '32165498703',
      curp_matricula: null,
      contacto_emergencia: 'María Castillo Vega',
      telefono_emergencia: '6643334455',
      parentesco_emergencia: 'Madre',
      actualizado_at: new Date('2026-02-28T16:00:00'),
    },
    {
      doctor_id: sofiaId,
      nombre: 'Lucía',
      apellidos: 'Ramírez Soto',
      fecha_nacimiento: new Date('2000-05-30'),
      es_externo: false,
      correo: 'lucia.ramirez@gmail.com',
      telefono: '6645678901',
      genero: 'Femenino',
      domicilio: 'Calle Madero 12, Tijuana, BC',
      ocupacion: 'Estudiante',
      estado_civil: 'Soltera',
      nivel_educativo: 'Bachillerato',
      religion: 'Católica',
      nss: '96385274104',
      curp_matricula: null,
      contacto_emergencia: 'Rosa Soto Díaz',
      telefono_emergencia: '6644445566',
      parentesco_emergencia: 'Madre',
      actualizado_at: new Date('2026-03-05T14:20:00'),
    },
  ]

  // helper para obtener paciente por correo
  const getPacienteId = async (correo) => {
    const p = await prisma.pacientes.findFirst({ where: { correo } })
    return p?.id ?? null
  }

  for (const p of pacientesData) {
    const existing = await prisma.pacientes.findFirst({
      where: { correo: p.correo },
    })
    if (!existing) {
      await prisma.pacientes.create({ data: { id: newId(), ...p } })
    }
  }

  console.log('✓ Pacientes insertados')

  // ═══════════════════════════════════════════
  // 6. HISTORIAS MÉDICAS
  // ═══════════════════════════════════════════
  const pacCarlosId = await getPacienteId('carlos.mendoza@gmail.com')
  const pacAnaId = await getPacienteId('ana.fernandez@hotmail.com')
  const pacJorgeId = await getPacienteId('jorge.reyes@yahoo.com')
  const pacLuciaId = await getPacienteId('lucia.ramirez@gmail.com')

  // Usamos el primer usuario como usuario_id (igual que el SQL: SELECT id FROM usuarios LIMIT 1)
  const primerUsuario = await prisma.usuarios.findFirst()
  const primerUsuarioId = primerUsuario.id

  const historiasData = [
    {
      id: uuidToBuf(HM_IDS.carlos),
      paciente_id: pacCarlosId,
      usuario_id: primerUsuarioId,
      tipo_sangre: 'O+',
      vacunas_infancia_completas: true,
      motivo_consulta: 'Revisión anual',
      historia_enfermedad_actual: 'Paciente acude a revisión de rutina sin síntomas agudos',
    },
    {
      id: uuidToBuf(HM_IDS.ana),
      paciente_id: pacAnaId,
      usuario_id: primerUsuarioId,
      tipo_sangre: 'A-',
      vacunas_infancia_completas: true,
      motivo_consulta: 'Control de diabetes',
      historia_enfermedad_actual:
        'Paciente con DM2 de 5 años de evolución, refiere polidipsia y poliuria',
    },
    {
      id: uuidToBuf(HM_IDS.jorge),
      paciente_id: pacJorgeId,
      usuario_id: primerUsuarioId,
      tipo_sangre: 'O-',
      vacunas_infancia_completas: true,
      motivo_consulta: 'Evaluación general',
      historia_enfermedad_actual: 'Médico externo, acude a evaluación anual de salud',
    },
    {
      id: uuidToBuf(HM_IDS.lucia),
      paciente_id: pacLuciaId,
      usuario_id: primerUsuarioId,
      tipo_sangre: 'B+',
      vacunas_infancia_completas: true,
      motivo_consulta: 'Examen preventivo',
      historia_enfermedad_actual:
        'Estudiante joven, sin antecedentes relevantes, acude a examen preventivo',
    },
  ]

  for (const h of historiasData) {
    const existing = await prisma.historias_medicas.findUnique({
      where: { id: h.id },
    })
    if (!existing) {
      await prisma.historias_medicas.create({ data: h })
    }
  }

  console.log('✓ Historias médicas insertadas')

  // ═══════════════════════════════════════════
  // 7. NOTAS DE EVOLUCIÓN
  // ═══════════════════════════════════════════
  const notasData = [
    {
      id: uuidToBuf(NE_IDS.ne1),
      historia_medica_id: uuidToBuf(HM_IDS.carlos),
      usuario_id: primerUsuarioId,
      motivo_consulta: 'Revisión anual. Paciente sin quejas.',
      ant_gine_andro: 'Sin antecedentes gineco-andros relevantes',
      estudios_complementarios_efectuados: 'Examen médico general de rutina',
      creado_at: new Date('2026-01-10T10:00:00'),
    },
    {
      id: uuidToBuf(NE_IDS.ne2),
      historia_medica_id: uuidToBuf(HM_IDS.ana),
      usuario_id: primerUsuarioId,
      motivo_consulta: 'Control de diabetes. Refiere mejora parcial con medicamento.',
      ant_gine_andro: 'G2 P2 A0, ciclos regulares',
      estudios_complementarios_efectuados: 'Glucosa en ayuno, HbA1c',
      creado_at: new Date('2026-02-14T14:30:00'),
    },
    {
      id: uuidToBuf(NE_IDS.ne3),
      historia_medica_id: uuidToBuf(HM_IDS.carlos),
      usuario_id: primerUsuarioId,
      motivo_consulta: 'Seguimiento post-revisión. Resultados de laboratorio normales.',
      ant_gine_andro: 'Sin cambios',
      estudios_complementarios_efectuados: 'Resultados de laboratorio normales',
      creado_at: new Date('2026-03-22T09:15:00'),
    },
    {
      id: uuidToBuf(NE_IDS.ne4),
      historia_medica_id: uuidToBuf(HM_IDS.jorge),
      usuario_id: primerUsuarioId,
      motivo_consulta: 'Evaluación integral. Profesional médico en buen estado de salud.',
      ant_gine_andro: 'Sin antecedentes relevantes',
      estudios_complementarios_efectuados: 'Examen clínico completo, signos vitales normales',
      creado_at: new Date('2026-03-01T11:45:00'),
    },
    {
      id: uuidToBuf(NE_IDS.ne5),
      historia_medica_id: uuidToBuf(HM_IDS.lucia),
      usuario_id: primerUsuarioId,
      motivo_consulta: 'Examen preventivo anual. Estudiante sin síntomas. Vida sana.',
      ant_gine_andro: 'Ginecología normal, ciclos regulares',
      estudios_complementarios_efectuados: 'Laboratorio rutinario, ecografía pélvica',
      creado_at: new Date('2026-02-20T15:30:00'),
    },
  ]

  for (const n of notasData) {
    const existing = await prisma.notas_evolucion.findUnique({
      where: { id: n.id },
    })
    if (!existing) {
      await prisma.notas_evolucion.create({ data: n })
    }
  }

  console.log('✓ Notas de evolución insertadas')

  // ═══════════════════════════════════════════
  // 8. APARATOS Y SISTEMAS
  // ═══════════════════════════════════════════
  const aparatosData = [
    {
      historia_medica_id: uuidToBuf(HM_IDS.carlos),
      nota_evolucion_id: uuidToBuf(NE_IDS.ne1),
      neurologico: 'Sin alteraciones',
      cardiovascular: 'Ritmo cardíaco regular',
      respiratorio: 'Respiración normal',
      hematologico: 'Sin anemia',
      digestivo: 'Sin molestias digestivas',
      musculoesqueletico: 'Sin dolor articular',
      genitourinario: 'Sin alteraciones urinarias',
      endocrinologico: 'Sin alteraciones tiroideas',
      metabolico: 'Metabolismo normal',
      nutricional: 'Nutrición adecuada',
    },
    {
      historia_medica_id: uuidToBuf(HM_IDS.ana),
      nota_evolucion_id: uuidToBuf(NE_IDS.ne2),
      neurologico: 'Cefalea ocasional',
      cardiovascular: 'Palpitaciones leves',
      respiratorio: 'Tos crónica leve',
      hematologico: 'Sin alteraciones',
      digestivo: 'Gastritis referida',
      musculoesqueletico: 'Lumbalgia crónica',
      genitourinario: 'Sin alteraciones',
      endocrinologico: 'Hipotiroidismo controlado',
      metabolico: 'Dislipidemia',
      nutricional: 'Déficit proteico',
    },
  ]

  for (const a of aparatosData) {
    const existing = await prisma.aparatos_sistemas.findFirst({
      where: { historia_medica_id: a.historia_medica_id },
    })
    if (!existing) {
      await prisma.aparatos_sistemas.create({ data: a })
    }
  }

  console.log('✓ Aparatos y sistemas insertados')

  // ═══════════════════════════════════════════
  // 9. INFORMACIÓN FÍSICA
  // ═══════════════════════════════════════════
  const infoFisicaData = [
    {
      historia_medica_id: uuidToBuf(HM_IDS.carlos),
      nota_evolucion_id: uuidToBuf(NE_IDS.ne1),
      peso: 72.5,
      altura: 1.75,
      pa_sistolica: 120,
      pa_diastolica: 80,
      fc: 72,
      fr: 16,
      circ_cintura: 88.0,
      circ_cadera: 95.0,
      sp_o2: 98.0,
      glucosa_capilar: 95.0,
      temperatura: 36.5,
      exploracion_fisica: 'Exploración física sin hallazgos relevantes',
      habito_exterior: 'Paciente en buen estado general',
    },
    {
      historia_medica_id: uuidToBuf(HM_IDS.ana),
      nota_evolucion_id: uuidToBuf(NE_IDS.ne2),
      peso: 85.0,
      altura: 1.68,
      pa_sistolica: 135,
      pa_diastolica: 88,
      fc: 80,
      fr: 18,
      circ_cintura: 102.0,
      circ_cadera: 108.0,
      sp_o2: 96.5,
      glucosa_capilar: 110.0,
      temperatura: 37.1,
      exploracion_fisica: 'Obesidad grado I, abdomen globoso',
      habito_exterior: 'Paciente con sobrepeso, consciente y orientado',
    },
  ]

  for (const info of infoFisicaData) {
    const existing = await prisma.informacion_fisica.findFirst({
      where: { historia_medica_id: info.historia_medica_id },
    })
    if (!existing) {
      await prisma.informacion_fisica.create({ data: info })
    }
  }

  console.log('✓ Información física insertada')

  // ═══════════════════════════════════════════
  // 10. PLANES DE ESTUDIO
  // ═══════════════════════════════════════════
  const planesData = [
    {
      historia_medica_id: uuidToBuf(HM_IDS.carlos),
      nota_evolucion_id: uuidToBuf(NE_IDS.ne1),
      plan_tratamiento: 'Examen médico general de rutina. BH, QS, EGO.',
      tratamiento: 'Observación y seguimiento en 3 meses',
    },
    {
      historia_medica_id: uuidToBuf(HM_IDS.ana),
      nota_evolucion_id: uuidToBuf(NE_IDS.ne2),
      plan_tratamiento: 'Diabetes mellitus tipo 2 sin complicaciones. Glucosa en ayuno, HbA1c.',
      tratamiento: 'Metformina 850mg c/12h + dieta hipocalórica',
    },
  ]

  const planIds = []
  for (const plan of planesData) {
    const existing = await prisma.planes_estudio.findFirst({
      where: { historia_medica_id: plan.historia_medica_id },
    })
    if (!existing) {
      const created = await prisma.planes_estudio.create({ data: plan })
      planIds.push(created.id)
    } else {
      planIds.push(existing.id)
    }
  }

  console.log('✓ Planes de estudio insertados')

  // ═══════════════════════════════════════════
  // 11. PLANES ESTUDIO CIE-10
  // ═══════════════════════════════════════════
  const cie10Data = [
    {
      plan_estudio_id: planIds[0],
      codigo: 'Z00.0',
      descripcion: 'Examen médico general',
    },
    {
      plan_estudio_id: planIds[1],
      codigo: 'E11.9',
      descripcion: 'Diabetes mellitus tipo 2 sin complicaciones',
    },
    {
      plan_estudio_id: planIds[1],
      codigo: 'E78.5',
      descripcion: 'Hiperlipidemia no especificada',
    },
  ]

  for (const cie of cie10Data) {
    const existing = await prisma.planes_estudio_cie10.findFirst({
      where: {
        plan_estudio_id: cie.plan_estudio_id,
        codigo: cie.codigo,
      },
    })
    if (!existing) {
      await prisma.planes_estudio_cie10.create({ data: cie })
    }
  }

  console.log('✓ Códigos CIE-10 insertados')

  // ═══════════════════════════════════════════
  // 12. PACIENTES DE NUTRICIÓN
  // ═══════════════════════════════════════════
  const anaToTorresId = await getUsuarioId('ana.torres@uabc.edu.mx')
  const mariaLopezId = await getUsuarioId('maria.lopez@uabc.edu.mx')

  const pacientesNutricion = [
    {
      doctor_id: anaToTorresId,
      nombre: 'Pedro',
      apellidos: 'Gómez Soto',
      fecha_nacimiento: new Date('1990-06-15'),
      es_externo: false,
      correo: 'pedro.gomez@gmail.com',
      telefono: '6646001001',
      genero: 'Masculino',
      domicilio: 'Calle Hidalgo 10, Tijuana, BC',
      ocupacion: 'Ingeniero',
      estado_civil: 'Casado',
      nivel_educativo: 'Licenciatura',
      religion: 'Católica',
      nss: '11223344501',
      actualizado_at: new Date('2026-04-10T10:00:00'),
    },
    {
      doctor_id: anaToTorresId,
      nombre: 'Valentina',
      apellidos: 'Cruz Medina',
      fecha_nacimiento: new Date('2005-03-22'),
      es_externo: false,
      correo: 'valentina.cruz@gmail.com',
      telefono: '6646001002',
      genero: 'Femenino',
      domicilio: 'Blvd. Insurgentes 200, Tijuana, BC',
      ocupacion: 'Estudiante',
      estado_civil: 'Soltera',
      nivel_educativo: 'Bachillerato',
      religion: 'Ninguna',
      nss: '22334455602',
      actualizado_at: new Date('2026-04-12T11:00:00'),
    },
    {
      doctor_id: mariaLopezId,
      nombre: 'Roberto',
      apellidos: 'Sánchez Vega',
      fecha_nacimiento: new Date('1975-11-08'),
      es_externo: true,
      correo: 'roberto.sanchez@hotmail.com',
      telefono: '6646001003',
      genero: 'Masculino',
      domicilio: 'Av. Constitución 45, Tijuana, BC',
      ocupacion: 'Médico',
      estado_civil: 'Divorciado',
      nivel_educativo: 'Doctorado',
      religion: 'Ninguna',
      nss: '33445566703',
      actualizado_at: new Date('2026-03-20T09:30:00'),
    },
    {
      doctor_id: mariaLopezId,
      nombre: 'Sofía',
      apellidos: 'Herrera Ponce',
      fecha_nacimiento: new Date('1998-07-14'),
      es_externo: false,
      correo: 'sofia.herrera@gmail.com',
      telefono: '6646001004',
      genero: 'Femenino',
      domicilio: 'Calle Juárez 78, Tijuana, BC',
      ocupacion: 'Enfermera',
      estado_civil: 'Soltera',
      nivel_educativo: 'Licenciatura',
      religion: 'Católica',
      nss: '44556677804',
      actualizado_at: new Date('2026-04-18T14:00:00'),
    },
    {
      doctor_id: sofiaId,
      nombre: 'Miguel',
      apellidos: 'Flores Ramos',
      fecha_nacimiento: new Date('2010-01-30'),
      es_externo: false,
      correo: 'miguel.flores@gmail.com',
      telefono: '6646001005',
      genero: 'Masculino',
      domicilio: 'Calle Morelos 33, Tijuana, BC',
      ocupacion: 'Estudiante',
      estado_civil: 'Soltero',
      nivel_educativo: 'Primaria',
      religion: 'Cristiana',
      nss: '55667788905',
      actualizado_at: new Date('2026-04-20T10:00:00'),
    },
  ]

  for (const p of pacientesNutricion) {
    const existing = await prisma.pacientes.findFirst({ where: { correo: p.correo } })
    if (!existing) {
      await prisma.pacientes.create({ data: { id: newId(), ...p } })
    }
  }

  console.log('✓ Pacientes de nutrición insertados')

  // ═══════════════════════════════════════════
  // 13. MEMBRESÍAS PACIENTE ↔ ÁREA
  // ═══════════════════════════════════════════
  const pacientesConDoctor = await prisma.pacientes.findMany({
    select: { id: true, doctor_id: true, usuarios: { select: { area_id: true } } },
  })
  for (const p of pacientesConDoctor) {
    if (p.usuarios.area_id == null) continue
    await prisma.pacientes_areas.upsert({
      where: { paciente_id_area_id: { paciente_id: p.id, area_id: p.usuarios.area_id } },
      update: {},
      create: { paciente_id: p.id, area_id: p.usuarios.area_id, doctor_id: p.doctor_id },
    })
  }

  // Jorge queda sincronizado en ambas áreas (medicina + nutrición)
  const areaNutricion = await prisma.areas.findFirst({ where: { nombre: 'NUTRICION' } })
  await prisma.pacientes_areas.upsert({
    where: { paciente_id_area_id: { paciente_id: pacJorgeId, area_id: areaNutricion.id } },
    update: {},
    create: { paciente_id: pacJorgeId, area_id: areaNutricion.id, doctor_id: anaToTorresId },
  })

  console.log('✓ Membresías paciente-área insertadas')

  // ═══════════════════════════════════════════
  // 14. REGISTRO DE AUDITORÍA
  // ═══════════════════════════════════════════
  const auditCount = await prisma.registro_auditoria.count()
  if (auditCount === 0) {
    const getAccionId = async (codigo) => {
      const a = await prisma.acciones.findFirst({ where: { codigo } })
      return a.id
    }
    const getEntidadId = async (nombre) => {
      const e = await prisma.entidades.findFirst({ where: { nombre } })
      return e.id
    }

    const [crearId, actualizarId, iniciarSesionId] = await Promise.all([
      getAccionId('CREAR'),
      getAccionId('ACTUALIZAR'),
      getAccionId('INICIAR_SESION'),
    ])

    const [notaId, historiaId, emergenciaId, pacienteId, usuarioId] = await Promise.all([
      getEntidadId('NOTA_EVOLUCION'),
      getEntidadId('HISTORIA_MEDICA'),
      getEntidadId('EMERGENCIA'),
      getEntidadId('PACIENTE'),
      getEntidadId('USUARIO'),
    ])

    const pacCarlosId2 = await getPacienteId('carlos.mendoza@gmail.com')
    const pacAnaId2 = await getPacienteId('ana.fernandez@hotmail.com')
    const pacJorgeId2 = await getPacienteId('jorge.reyes@yahoo.com')
    const pacLuciaId2 = await getPacienteId('lucia.ramirez@gmail.com')

    // Helper para fecha relativa (días + horas atrás desde ahora)
    const daysAgo = (n, hoursOffset = 2) => {
      return new Date(Date.now() - (n * 24 + hoursOffset) * 60 * 60 * 1000)
    }

    const auditoriaData = [
      // Logins
      {
        usuario_id: carlosId,
        accion_id: iniciarSesionId,
        entidad_id: usuarioId,
        fecha_hora: daysAgo(0, 8),
      },
      {
        usuario_id: sofiaId,
        accion_id: iniciarSesionId,
        entidad_id: usuarioId,
        fecha_hora: daysAgo(0, 9),
      },
      {
        usuario_id: carlosId,
        accion_id: iniciarSesionId,
        entidad_id: usuarioId,
        fecha_hora: daysAgo(1, 8),
      },
      {
        usuario_id: sofiaId,
        accion_id: iniciarSesionId,
        entidad_id: usuarioId,
        fecha_hora: daysAgo(2, 9),
      },
      {
        usuario_id: carlosId,
        accion_id: iniciarSesionId,
        entidad_id: usuarioId,
        fecha_hora: daysAgo(3, 8),
      },

      // Crear notas de evolución — últimos 7 días
      {
        usuario_id: carlosId,
        accion_id: crearId,
        entidad_id: notaId,
        objetivo_id: uuidToBuf(NE_IDS.ne1),
        paciente_id: pacCarlosId2,
        fecha_hora: daysAgo(0, 10),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: notaId,
        objetivo_id: uuidToBuf(NE_IDS.ne2),
        paciente_id: pacAnaId2,
        fecha_hora: daysAgo(0, 11),
      },
      {
        usuario_id: carlosId,
        accion_id: crearId,
        entidad_id: notaId,
        objetivo_id: uuidToBuf(NE_IDS.ne3),
        paciente_id: pacCarlosId2,
        fecha_hora: daysAgo(1, 9),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: notaId,
        objetivo_id: uuidToBuf(NE_IDS.ne4),
        paciente_id: pacJorgeId2,
        fecha_hora: daysAgo(2, 10),
      },
      {
        usuario_id: carlosId,
        accion_id: crearId,
        entidad_id: notaId,
        objetivo_id: uuidToBuf(NE_IDS.ne5),
        paciente_id: pacLuciaId2,
        fecha_hora: daysAgo(3, 14),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: notaId,
        objetivo_id: uuidToBuf(NE_IDS.ne1),
        paciente_id: pacAnaId2,
        fecha_hora: daysAgo(4, 10),
      },
      {
        usuario_id: carlosId,
        accion_id: crearId,
        entidad_id: notaId,
        objetivo_id: uuidToBuf(NE_IDS.ne2),
        paciente_id: pacCarlosId2,
        fecha_hora: daysAgo(5, 9),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: notaId,
        objetivo_id: uuidToBuf(NE_IDS.ne3),
        paciente_id: pacJorgeId2,
        fecha_hora: daysAgo(6, 11),
      },

      // Crear historias médicas — últimos 30 días
      {
        usuario_id: carlosId,
        accion_id: crearId,
        entidad_id: historiaId,
        objetivo_id: uuidToBuf(HM_IDS.carlos),
        paciente_id: pacCarlosId2,
        fecha_hora: daysAgo(0, 9),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: historiaId,
        objetivo_id: uuidToBuf(HM_IDS.ana),
        paciente_id: pacAnaId2,
        fecha_hora: daysAgo(3, 10),
      },
      {
        usuario_id: carlosId,
        accion_id: crearId,
        entidad_id: historiaId,
        objetivo_id: uuidToBuf(HM_IDS.jorge),
        paciente_id: pacJorgeId2,
        fecha_hora: daysAgo(7, 9),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: historiaId,
        objetivo_id: uuidToBuf(HM_IDS.lucia),
        paciente_id: pacLuciaId2,
        fecha_hora: daysAgo(10, 11),
      },
      {
        usuario_id: carlosId,
        accion_id: crearId,
        entidad_id: historiaId,
        objetivo_id: uuidToBuf(HM_IDS.carlos),
        paciente_id: pacCarlosId2,
        fecha_hora: daysAgo(15, 10),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: historiaId,
        objetivo_id: uuidToBuf(HM_IDS.ana),
        paciente_id: pacAnaId2,
        fecha_hora: daysAgo(20, 9),
      },

      // Actualizar historias
      {
        usuario_id: carlosId,
        accion_id: actualizarId,
        entidad_id: historiaId,
        objetivo_id: uuidToBuf(HM_IDS.carlos),
        paciente_id: pacCarlosId2,
        fecha_hora: daysAgo(1, 11),
      },
      {
        usuario_id: sofiaId,
        accion_id: actualizarId,
        entidad_id: historiaId,
        objetivo_id: uuidToBuf(HM_IDS.ana),
        paciente_id: pacAnaId2,
        fecha_hora: daysAgo(4, 13),
      },

      // Emergencias — últimos 30 días
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: emergenciaId,
        fecha_hora: daysAgo(0, 10),
      },
      {
        usuario_id: carlosId,
        accion_id: crearId,
        entidad_id: emergenciaId,
        fecha_hora: daysAgo(1, 14),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: emergenciaId,
        fecha_hora: daysAgo(4, 22),
      },
      {
        usuario_id: carlosId,
        accion_id: crearId,
        entidad_id: emergenciaId,
        fecha_hora: daysAgo(8, 10),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: emergenciaId,
        fecha_hora: daysAgo(12, 16),
      },

      // Crear pacientes de medicina
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: pacienteId,
        objetivo_id: pacCarlosId2,
        paciente_id: pacCarlosId2,
        fecha_hora: daysAgo(2, 9),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: pacienteId,
        objetivo_id: pacAnaId2,
        paciente_id: pacAnaId2,
        fecha_hora: daysAgo(5, 10),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: pacienteId,
        objetivo_id: pacJorgeId2,
        paciente_id: pacJorgeId2,
        fecha_hora: daysAgo(9, 11),
      },
      {
        usuario_id: sofiaId,
        accion_id: crearId,
        entidad_id: pacienteId,
        objetivo_id: pacLuciaId2,
        paciente_id: pacLuciaId2,
        fecha_hora: daysAgo(14, 9),
      },
    ]

    for (const a of auditoriaData) {
      await prisma.registro_auditoria.create({
        data: {
          id: newId(),
          usuario_id: a.usuario_id,
          accion_id: a.accion_id,
          entidad_id: a.entidad_id,
          objetivo_id: a.objetivo_id ?? null,
          paciente_id: a.paciente_id ?? null,
          fecha_hora: a.fecha_hora,
        },
      })
    }

    console.log('✓ Registro de auditoría insertado')
  } else {
    console.log('↷ Registro de auditoría ya existe, omitiendo')
  }

  console.log('\n✓ Seed completado exitosamente')
}

main()
  .catch((e) => {
    console.error('Error en seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
