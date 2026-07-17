import { Prisma } from '@prisma/client'
import { prisma } from '#config/prisma.js'
import { ROLES } from '@cais/shared/constants/users'
import { STATS_RANGES, STATS_RANGE_WINDOW } from '@cais/shared/constants/stats'
import { bufferToUUID, uuidToBuffer } from '#lib/uuid.js'

// Entidades por área para los counts de cards y la tendencia. Cada área tiene
// sus propias stats — no se comparten.
const AREA_CONFIG = {
  MEDICINA: [
    { key: 'notas_evolucion', entidad: 'NOTA_EVOLUCION' },
    { key: 'historias_medicas', entidad: 'HISTORIA_MEDICA' },
    { key: 'emergencias', entidad: 'EMERGENCIA' },
  ],
  NUTRICION: [
    { key: 'historias_nutricion', entidad: 'HISTORIA_NUTRICION' },
    { key: 'eval_antropometricas', entidad: 'EVAL_ANTROPOMETRICA' },
    { key: 'eval_nutricionales', entidad: 'EVAL_NUTRICIONAL' },
  ],
}

export class StatsModel {
  // Un pasante ve solo sus propias stats (los recursos que él creó); coordinador/
  // admin ven las globales de su área. `range` acota la ventana de tiempo de los
  // counts y la tendencia (género/edad son históricos y no se ven afectados).
  static async getStats({ area, userId, role, range }) {
    const scope = buildScope({ area, userId, role })
    const period = rangeConfig(range)

    const [
      pacientes,
      usuariosConectados,
      distribucionGenero,
      distribucionEdad,
      distribucionProcedencia,
      actividadReciente,
      tendencia,
      areaSpecificCounts,
    ] = await Promise.all([
      this.#countPacientes(scope, period),
      scope.personal ? Promise.resolve(null) : this.#countUsuariosConectados(),
      this.#getDistribucionGenero(scope),
      this.#getDistribucionEdad(scope),
      this.#getDistribucionProcedencia(scope),
      this.#getActividadReciente(scope),
      this.#getTendencia(scope, period),
      this.#getAreaSpecificCounts(scope, period),
    ])

    return {
      counts: {
        // usuarios_conectados es global; no aplica a la vista personal del pasante.
        ...(usuariosConectados !== null && { usuarios_conectados: usuariosConectados }),
        pacientes,
        ...areaSpecificCounts,
      },
      actividad_reciente: actividadReciente,
      tendencia,
      distribucion_genero: distribucionGenero,
      distribucion_edad: distribucionEdad,
      distribucion_procedencia: distribucionProcedencia,
    }
  }

  static async #countPacientes(scope, period) {
    return prisma.pacientes.count({
      where: { usuarios: scope.usuariosFilter, creado_at: { gte: period.since } },
    })
  }

  static async #countUsuariosConectados() {
    return prisma.sessions.count({
      where: { expire: { gt: new Date() } },
    })
  }

  static async #getDistribucionGenero(scope) {
    const result = await prisma.pacientes.groupBy({
      by: ['genero'],
      _count: { id: true },
      where: { usuarios: scope.usuariosFilter, genero: { not: null } },
    })
    return result.map((r) => ({ genero: r.genero, count: r._count.id }))
  }

  // Interno = paciente de la UABC (es_externo=false); externo = ajeno a la
  // universidad. Histórico, no acotado por el rango de tiempo.
  static async #getDistribucionProcedencia(scope) {
    const result = await prisma.pacientes.groupBy({
      by: ['es_externo'],
      _count: { id: true },
      where: { usuarios: scope.usuariosFilter },
    })
    // Normaliza el null (dato viejo sin capturar) a interno, que es el default.
    const buckets = { interno: 0, externo: 0 }
    for (const r of result) buckets[r.es_externo ? 'externo' : 'interno'] += r._count.id
    return Object.entries(buckets).map(([procedencia, count]) => ({ procedencia, count }))
  }

  static async #getDistribucionEdad(scope) {
    const rows = await prisma.$queryRaw`
      SELECT
        CASE
          WHEN TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) < 18 THEN '< 18'
          WHEN TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) BETWEEN 18 AND 59 THEN '18 - 59'
          ELSE '>= 60'
        END AS rango,
        COUNT(*) AS count
      FROM pacientes p
      JOIN usuarios u ON p.doctor_id = u.id
      JOIN areas a ON u.area_id = a.id
      WHERE ${scope.sql('a')}
        AND p.fecha_nacimiento IS NOT NULL
      GROUP BY rango
      ORDER BY
        CASE rango
          WHEN '< 18' THEN 1
          WHEN '18 - 59' THEN 2
          ELSE 3
        END
    `
    // Always return all 3 buckets so the chart legend is consistent
    const buckets = { '< 18': 0, '18 - 59': 0, '>= 60': 0 }
    for (const r of rows) buckets[r.rango] = Number(r.count)
    return Object.entries(buckets).map(([rango, count]) => ({ rango, count }))
  }

  static async #getActividadReciente(scope) {
    const records = await prisma.registro_auditoria.findMany({
      where: { usuarios: scope.usuariosFilter },
      include: {
        acciones: true,
        entidades: true,
        usuarios: true,
      },
      orderBy: { fecha_hora: 'desc' },
      take: 10,
    })

    return records.map((r) => ({
      id: bufferToUUID(r.id),
      accion: r.acciones?.codigo ?? null,
      entidad: r.entidades?.nombre ?? null,
      usuario: r.usuarios?.nombre ?? null,
      foto: r.usuarios?.foto ?? null,
      email: r.usuarios?.correo ?? null,
      paciente_id: r.paciente_id ? bufferToUUID(r.paciente_id) : null,
      objetivo_id: r.objetivo_id ? bufferToUUID(r.objetivo_id) : null,
      fecha_hora: r.fecha_hora,
    }))
  }

  static async #getTendencia(scope, period) {
    const areaEntidades = AREA_CONFIG[scope.area] ?? []
    const allEntidades = [...areaEntidades, { key: 'pacientes', entidad: 'PACIENTE' }]

    const results = await Promise.all(
      allEntidades.map(({ key, entidad }) =>
        prisma.$queryRaw`
          SELECT DATE_FORMAT(ra.fecha_hora, ${period.fmt}) as periodo, COUNT(*) as count
          FROM registro_auditoria ra
          JOIN acciones ac ON ra.accion_id = ac.id
          JOIN entidades e ON ra.entidad_id = e.id
          JOIN usuarios u ON ra.usuario_id = u.id
          JOIN areas a ON u.area_id = a.id
          WHERE ac.codigo = 'CREAR'
            AND e.nombre = ${entidad}
            AND ${scope.sql('a')}
            AND ra.fecha_hora >= ${period.since}
          GROUP BY periodo
        `.then((rows) => ({ key, rows }))
      )
    )

    const map = Object.fromEntries(period.buckets.map((b) => [b, { fecha: b }]))
    for (const { key, rows } of results) {
      for (const row of rows) {
        const periodo = String(row.periodo)
        if (map[periodo]) map[periodo][key] = Number(row.count)
      }
    }

    return period.buckets.map((b) => {
      const entry = map[b]
      const filled = { fecha: b }
      for (const { key } of allEntidades) filled[key] = entry[key] ?? 0
      return filled
    })
  }

  static async #getAreaSpecificCounts(scope, period) {
    const entidades = AREA_CONFIG[scope.area] ?? []
    if (entidades.length === 0) return {}

    const counts = await Promise.all(
      entidades.map(({ key, entidad }) =>
        prisma.registro_auditoria
          .count({
            where: {
              acciones: { codigo: 'CREAR' },
              entidades: { nombre: entidad },
              usuarios: scope.usuariosFilter,
              fecha_hora: { gte: period.since },
            },
          })
          .then((count) => [key, count])
      )
    )

    return Object.fromEntries(counts)
  }
}

// Resuelve el alcance de las stats: filtro de Prisma (`usuariosFilter`) y fragmento
// SQL crudo (`sql(alias)`) reutilizables por cada query. `alias` es el alias de la
// tabla `areas` en el query crudo.
function buildScope({ area, userId, role }) {
  if (role === ROLES.PASANTE) {
    const userBuffer = uuidToBuffer(userId)
    return {
      area,
      personal: true,
      usuariosFilter: { id: userBuffer },
      sql: () => Prisma.sql`u.id = ${userBuffer}`,
    }
  }
  // El admin no tiene área: ve las stats globales de todas las áreas.
  if (role === ROLES.ADMIN) {
    return {
      area: null,
      personal: false,
      usuariosFilter: {},
      sql: () => Prisma.sql`1 = 1`,
    }
  }
  return {
    area,
    personal: false,
    usuariosFilter: { areas: { nombre: area } },
    sql: (alias) => Prisma.sql`${Prisma.raw(alias)}.nombre = ${area}`,
  }
}

// Traduce el rango a: fecha de inicio (`since`), formato SQL de agrupación (`fmt`,
// para DATE_FORMAT) y la lista ordenada de buckets a rellenar (`buckets`).
// Semana/mes agrupan por día; año agrupa por mes.
function rangeConfig(range) {
  const now = new Date()

  if (range === STATS_RANGES.YEAR) {
    const months = STATS_RANGE_WINDOW[STATS_RANGES.YEAR].months
    const buckets = Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })
    const since = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)
    return { since, fmt: '%Y-%m', buckets }
  }

  const dayCount = (STATS_RANGE_WINDOW[range] ?? STATS_RANGE_WINDOW[STATS_RANGES.WEEK]).days
  const buckets = Array.from({ length: dayCount }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (dayCount - 1 - i))
    return d.toISOString().slice(0, 10)
  })
  const since = new Date()
  since.setDate(since.getDate() - (dayCount - 1))
  since.setHours(0, 0, 0, 0)
  return { since, fmt: '%Y-%m-%d', buckets }
}
