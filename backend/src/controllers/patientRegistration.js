import { prisma } from '#config/prisma.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

/**
 * Construye un controller de registro atómico (paciente + 1ª historia) por área.
 * Medicina y nutrición solo difieren en el modelo de historia y la entidad
 * auditada, así que el flujo vive aquí una sola vez. La validación del body
 * (`{ patient, historia }`) la aplica el middleware `validate` en la ruta.
 *
 * @param {object} deps
 * @param {(data: object, userId: string, tx: object) => Promise} deps.createHistory
 * @param {string} deps.historiaEntidad - ENTIDADES.HISTORIA_*
 * @param {string} deps.errorLabel - área para el log de error
 */
export function makePatientRegistrationController({ createHistory, historiaEntidad, errorLabel }) {
  return {
    async create(req, res) {
      const { patient, historia } = req.body
      const userId = req.session.userId

      try {
        const data = await prisma.$transaction(async (tx) => {
          const p = await PatientModel.create(patient, userId, tx)
          const h = await createHistory({ ...historia, paciente_id: p.id }, userId, tx)
          await AuditModel.create(
            {
              usuario_id: userId,
              accion: ACCIONES.CREAR,
              entidad: ENTIDADES.PACIENTE,
              objetivo_id: p.id,
              paciente_id: p.id,
            },
            tx
          )
          await AuditModel.create(
            {
              usuario_id: userId,
              accion: ACCIONES.CREAR,
              entidad: historiaEntidad,
              objetivo_id: h.id,
              paciente_id: p.id,
            },
            tx
          )
          return { patient: p, historia: h }
        })
        return res.status(201).json({ message: 'Paciente registrado', ...data })
      } catch (err) {
        console.error(`Error al registrar paciente de ${errorLabel}:`, err)
        return res.status(500).json({ error: 'Error al registrar al paciente' })
      }
    },
  }
}
