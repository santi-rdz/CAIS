import { prisma } from '#config/prisma.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'
import { ForbiddenError } from '#lib/appError.js'

/**
 * Construye un controller de registro atómico (paciente + 1ª historia) por área.
 * Medicina y nutrición solo difieren en el modelo de historia y la entidad
 * auditada, así que el flujo vive aquí una sola vez. La validación del body la
 * aplica el middleware `validate` en la ruta: `{ patient, historia }` crea un
 * paciente nuevo; `{ paciente_id, patient?, historia }` sincroniza uno existente
 * de la otra área (membresía + historia + datos complementarios sin sobrescribir
 * la ficha existente).
 *
 * @param {object} deps
 * @param {(data: object, userId: string, tx: object) => Promise} deps.createHistory
 * @param {string} deps.historiaEntidad - ENTIDADES.HISTORIA_*
 */
export function makePatientRegistrationController({ createHistory, historiaEntidad }) {
  return {
    async create(req, res) {
      const { patient, paciente_id, historia } = req.body
      const { userId, areaId } = req.session
      if (areaId == null) {
        throw new ForbiddenError('Área no definida para este usuario')
      }

      const data = await prisma.$transaction(async (tx) => {
        let p
        if (paciente_id) {
          await PatientModel.addArea(paciente_id, areaId, userId, tx)
          if (patient) await PatientModel.fillMissing(paciente_id, patient, tx)
          p = await PatientModel.getById(paciente_id, tx)
        } else {
          p = await PatientModel.create(patient, userId, areaId, tx)
        }
        const h = await createHistory({ ...historia, paciente_id: p.id }, userId, tx)
        await AuditModel.create(
          {
            usuario_id: userId,
            accion: paciente_id ? ACCIONES.ACTUALIZAR : ACCIONES.CREAR,
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
      const message = paciente_id ? 'Paciente sincronizado' : 'Paciente registrado'
      res.status(201).json({ message, ...data })
    },
  }
}
