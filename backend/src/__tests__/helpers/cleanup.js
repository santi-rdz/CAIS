/**
 * @file Cleanup tracker para tests de integración.
 *
 * Patrón: cada test file crea un tracker en beforeAll, registra los IDs que
 * crea (directamente o vía factories de db.js), y llama tracker.cleanup() en
 * afterAll. El orden de eliminación respeta las foreign keys del schema.
 *
 * Tablas dentro del mismo nivel se borran en paralelo (no se referencian
 * entre sí). Niveles consecutivos son secuenciales (hijos antes que padres).
 *
 * Sessions NO se trackean: la tabla `sessions` no tiene FK a `usuarios`
 * (`sid` PK, `data` JSON text). Se limpian por TTL natural.
 */

import { prisma } from '#config/prisma.js'

const DELETE_ORDER = [
  // Nivel 1: sub-evaluaciones nutricionales 1-1 con eval_nutr_fh
  ['eval_apetito_nutricion', 'frec_consumo_alimentos_nutricion', 'horarios_comida_nutricion'],

  // Nivel 2: parents intermedios (hijos de pacientes / historias_medicas)
  [
    'eval_nutr_fh',
    'notas_evolucion',
    'bitacora_emergencias',
    'aparatos_sistemas',
    'informacion_fisica',
    'inmunizaciones',
    'antecedentes_familiares',
    'antecedentes_no_patologicos',
    'antecedentes_patologicos',
    'planes_estudio',
  ],

  // Nivel 3: hijos directos de pacientes
  ['historias_medicas', 'historias_pacientes_nutricion', 'exam_fis_orien_nutricion'],

  // Nivel 3.5: adicciones es padre de historias_pacientes_nutricion (FK
  // adicciones_id), así que se borra después de las historias que la referencian.
  ['adicciones'],

  // Nivel 4: hijos de usuarios que no son audit
  ['invitaciones_registro', 'password_reset_tokens'],

  // Nivel 5: pacientes (depende de usuarios via doctor_id)
  ['pacientes'],

  // Nivel 6: usuarios (audit se borra en pre-step)
  ['usuarios'],
]

/**
 * Crea un nuevo cleanup tracker. Una instancia por test file.
 *
 * @returns {{
 *   track: (table: string, id: Buffer|number|string) => void,
 *   cleanup: () => Promise<void>
 * }}
 */
export function createCleanupTracker() {
  const records = new Map()

  return {
    track(table, id) {
      if (!records.has(table)) records.set(table, new Set())
      records.get(table).add(id)
    },

    async cleanup() {
      // Pre-step: borrar audit entries de los usuarios tracked.
      // registro_auditoria tiene FK rígida a usuarios — si no se borra primero,
      // delete usuarios falla.
      const userIds = records.get('usuarios')
      if (userIds?.size) {
        try {
          await prisma.registro_auditoria.deleteMany({
            where: { usuario_id: { in: [...userIds] } },
          })
        } catch (err) {
          // Audit no es crítico; warn pero no rompas el cleanup.
          console.warn(`Cleanup registro_auditoria: ${err.message}`)
        }
      }

      // Pre-step 2: borrar hijos de historias_pacientes_nutricion por historia_paciente_id.
      // Prisma con adapter MariaDB no aplica ON DELETE CASCADE automáticamente,
      // así que hay que borrar los hijos manualmente antes que el padre.
      const nutricionIds = records.get('historias_pacientes_nutricion')
      if (nutricionIds?.size) {
        const idList = [...nutricionIds]
        try {
          await Promise.all([
            prisma.historias_medicas_nutricion.deleteMany({
              where: { historia_paciente_id: { in: idList } },
            }),
            prisma.eval_act_fisica_nutricion.deleteMany({
              where: { historia_paciente_id: { in: idList } },
            }),
            prisma.eval_cal_sueno.deleteMany({ where: { historia_paciente_id: { in: idList } } }),
            prisma.tratamiento_alt_nutricion.deleteMany({
              where: { historia_paciente_id: { in: idList } },
            }),
          ])
        } catch (err) {
          console.warn(`Cleanup hijos nutricion: ${err.message}`)
        }
      }

      // Pre-step 3: borrar hijos de exam_fis_orien_nutricion.
      const examFisIds = records.get('exam_fis_orien_nutricion')
      if (examFisIds?.size) {
        const idList = [...examFisIds]
        try {
          const exams = await prisma.exam_fis_orien_nutricion.findMany({
            where: { id: { in: idList } },
            select: {
              id_perdida_peso: true,
              id_signos_vitales: true,
              id_semiologia: true,
            },
          })

          await Promise.all([
            prisma.eval_sintomas_gastroin_nutricion.deleteMany({
              where: { exam_fis_id: { in: idList } },
            }),
            prisma.eval_perdida_peso_nutricion.deleteMany({
              where: { id: { in: exams.map((e) => e.id_perdida_peso) } },
            }),
            prisma.signos_vitales_nutricion.deleteMany({
              where: { id: { in: exams.map((e) => e.id_signos_vitales) } },
            }),
            prisma.eval_semiologia_nutricional.deleteMany({
              where: { id: { in: exams.map((e) => e.id_semiologia) } },
            }),
          ])
        } catch (err) {
          console.warn(`Cleanup hijos exam_fis: ${err.message}`)
        }
      }

      // Borrar por niveles. Dentro del mismo nivel, en paralelo.
      for (const level of DELETE_ORDER) {
        await Promise.all(
          level.map(async (table) => {
            const ids = records.get(table)
            if (!ids?.size) return
            try {
              await prisma[table].deleteMany({ where: { id: { in: [...ids] } } })
            } catch (err) {
              console.error(`Cleanup failed for ${table}: ${err.message}`)
              throw err
            }
          })
        )
      }
    },
  }
}
