import { prisma } from '#config/prisma.js'
import { bufferToUUID } from '#lib/uuid.js'

const thirtyDaysAgo = () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
const sevenDaysAgo = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

// Area-specific entities for counts and trend
const AREA_CONFIG = {
  MEDICINA: [
    { key: 'notas_evolucion', entidad: 'NOTA_EVOLUCION' },
    { key: 'historias_medicas', entidad: 'HISTORIA_MEDICA' },
    { key: 'emergencias', entidad: 'EMERGENCIA' },
  ],
}

export class DashboardModel {
  static async getStats(area) {
    const [
      pacientes,
      usuariosConectados,
      distribucionGenero,
      distribucionEdad,
      actividadReciente,
      tendenciaSemanal,
      areaSpecificCounts,
    ] = await Promise.all([
      this.#countPacientes(area),
      this.#countUsuariosConectados(),
      this.#getDistribucionGenero(area),
      this.#getDistribucionEdad(area),
      this.#getActividadReciente(area),
      this.#getTendenciaSemanal(area),
      this.#getAreaSpecificCounts(area),
    ])

    return {
      counts: {
        usuarios_conectados: usuariosConectados,
        pacientes,
        ...areaSpecificCounts,
      },
      actividad_reciente: actividadReciente,
      tendencia_semanal: tendenciaSemanal,
      distribucion_genero: distribucionGenero,
      distribucion_edad: distribucionEdad,
    }
  }

  static async #countPacientes(area) {
    return prisma.pacientes.count({
      where: {
        usuarios: { areas: { nombre: area } },
        creado_at: { gte: thirtyDaysAgo() },
      },
    })
  }

  static async #countUsuariosConectados() {
    return prisma.sessions.count({
      where: { expire: { gt: new Date() } },
    })
  }

  static async #getDistribucionGenero(area) {
    const result = await prisma.pacientes.groupBy({
      by: ['genero'],
      _count: { id: true },
      where: {
        usuarios: { areas: { nombre: area } },
        genero: { not: null },
      },
    })
    return result.map((r) => ({ genero: r.genero, count: r._count.id }))
  }

  static async #getDistribucionEdad(area) {
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
      WHERE a.nombre = ${area}
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

  static async #getActividadReciente(area) {
    const records = await prisma.registro_auditoria.findMany({
      where: {
        usuarios: { areas: { nombre: area } },
      },
      include: {
        acciones: true,
        entidades: true,
        usuarios: true,
      },
      orderBy: { fecha_hora: 'desc' },
      take: 10,
    })

    return records.map((r) => ({
      accion: r.acciones?.codigo ?? null,
      entidad: r.entidades?.nombre ?? null,
      usuario: r.usuarios?.nombre ?? null,
      foto: r.usuarios?.foto ?? null,
      email: r.usuarios?.email ?? null,
      paciente_id: r.paciente_id ? bufferToUUID(r.paciente_id) : null,
      objetivo_id: r.objetivo_id ? bufferToUUID(r.objetivo_id) : null,
      fecha_hora: r.fecha_hora,
    }))
  }

  static async #getTendenciaSemanal(area) {
    const areaEntidades = AREA_CONFIG[area] ?? []
    const allEntidades = [...areaEntidades, { key: 'pacientes', entidad: 'PACIENTE' }]

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().slice(0, 10)
    })

    const results = await Promise.all(
      allEntidades.map(({ key, entidad }) =>
        prisma.$queryRaw`
          SELECT DATE(ra.fecha_hora) as fecha, COUNT(*) as count
          FROM registro_auditoria ra
          JOIN acciones ac ON ra.accion_id = ac.id
          JOIN entidades e ON ra.entidad_id = e.id
          JOIN usuarios u ON ra.usuario_id = u.id
          JOIN areas ar ON u.area_id = ar.id
          WHERE ac.codigo = 'CREAR'
            AND e.nombre = ${entidad}
            AND ar.nombre = ${area}
            AND ra.fecha_hora >= ${sevenDaysAgo()}
          GROUP BY DATE(ra.fecha_hora)
        `.then((rows) => ({ key, rows }))
      )
    )

    const map = Object.fromEntries(days.map((d) => [d, { fecha: d }]))
    for (const { key, rows } of results) {
      for (const row of rows) {
        const fecha =
          row.fecha instanceof Date ? row.fecha.toISOString().slice(0, 10) : String(row.fecha)
        if (map[fecha]) map[fecha][key] = Number(row.count)
      }
    }

    return days.map((d) => {
      const entry = map[d]
      const filled = { fecha: d }
      for (const { key } of allEntidades) filled[key] = entry[key] ?? 0
      return filled
    })
  }

  static async #getAreaSpecificCounts(area) {
    const entidades = AREA_CONFIG[area] ?? []
    if (entidades.length === 0) return {}

    const counts = await Promise.all(
      entidades.map(({ key, entidad }) =>
        prisma.registro_auditoria
          .count({
            where: {
              acciones: { codigo: 'CREAR' },
              entidades: { nombre: entidad },
              usuarios: { areas: { nombre: area } },
              fecha_hora: { gte: thirtyDaysAgo() },
            },
          })
          .then((count) => [key, count])
      )
    )

    return Object.fromEntries(counts)
  }
}
