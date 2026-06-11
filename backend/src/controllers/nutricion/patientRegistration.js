import { prisma } from '#config/prisma.js'
import { PatientModel } from '#models/PatientModel.js'
import { NutritionHistoryModel } from '#models/nutricion/NutritionHistory.js'
import { AuditModel } from '#models/AuditModel.js'
import { validateNutritionRegistration } from '@cais/shared/schemas/nutricion/patientRegistration'
import { formatZodErrors } from '#lib/formatErrors.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

export class NutritionPatientRegistrationController {
  static async create(req, res) {
    const result = validateNutritionRegistration(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de registro inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    const { patient, historia } = result.data
    const userId = req.session.userId

    try {
      const data = await prisma.$transaction(async (tx) => {
        const p = await PatientModel.create(patient, userId, tx)
        const h = await NutritionHistoryModel.create({ ...historia, paciente_id: p.id }, tx)
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
            entidad: ENTIDADES.HISTORIA_NUTRICION,
            objetivo_id: h.id,
            paciente_id: p.id,
          },
          tx
        )
        return { patient: p, historia: h }
      })
      return res.status(201).json({ message: 'Paciente registrado', ...data })
    } catch (err) {
      console.error('Error al registrar paciente de nutrición:', err)
      return res.status(500).json({ error: 'Error al registrar al paciente' })
    }
  }
}
