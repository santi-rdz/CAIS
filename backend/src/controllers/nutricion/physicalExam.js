import { prisma } from '#config/prisma.js'
import { PhysicalExaminationModel } from '#models/nutricion/PhysicalExam.js'
import { PatientModel } from '#models/PatientModel.js'
import { AuditModel } from '#models/AuditModel.js'
import { parsePagination } from '#lib/paginate.js'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'
import { isUUID } from '@cais/shared/schemas/fields'

const LISTABLE_FIELDS = new Set(['id', 'paciente_id', 'fecha'])

export class PhysicalExaminationController {
  static async create(req, res) {
    try {
      const exam = await prisma.$transaction(async (tx) => {
        const e = await PhysicalExaminationModel.create(req.body, tx)
        await PatientModel.touch(req.body.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.CREAR,
            entidad: ENTIDADES.EXAM_FIS_ORIEN_NUTRICION,
            objetivo_id: e.id,
            paciente_id: e.paciente_id,
          },
          tx
        )
        return e
      })
      return res.status(201).json({ message: 'Examen físico de orientación registrado', exam })
    } catch (error) {
      console.error('Error al crear examen físico de orientación:', error)
      return res.status(500).json({ message: 'Error al registrar examen físico de orientación' })
    }
  }

  static async getAll(req, res) {
    const { paciente_id, fields } = req.query
    const { page, limit } = parsePagination(req.query)

    if (paciente_id !== undefined && !isUUID(paciente_id)) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "paciente_id" debe ser un UUID válido',
      })
    }

    if (fields !== undefined && typeof fields !== 'string') {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "fields" debe ser una cadena separada por comas',
      })
    }

    const parsedFields = fields
      ? fields
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
      : null

    if (parsedFields && parsedFields.some((field) => !LISTABLE_FIELDS.has(field))) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'El parámetro "fields" contiene valores no permitidos',
      })
    }

    try {
      const result = await PhysicalExaminationModel.getAll({
        paciente_id,
        page,
        limit,
        fields: parsedFields,
      })
      return res.json(result)
    } catch (err) {
      console.error('Error al obtener exámenes físicos de orientación:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener exámenes físicos de orientación',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params
    try {
      const exam = await PhysicalExaminationModel.getById(id)
      if (!exam)
        return res.status(404).json({ message: 'Examen físico de orientación no encontrado' })
      return res.json(exam)
    } catch (err) {
      console.error('Error al obtener examen físico de orientación:', err)
      return res.status(500).json({
        error: 'InternalError',
        message: 'Error al obtener examen físico de orientación',
      })
    }
  }

  static async delete(req, res) {
    const { id } = req.params
    try {
      const exam = await prisma.$transaction(async (tx) => {
        const e = await PhysicalExaminationModel.delete(id, tx)
        if (!e) return null
        await PatientModel.touch(e.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ELIMINAR,
            entidad: ENTIDADES.EXAM_FIS_ORIEN_NUTRICION,
            objetivo_id: e.id,
            paciente_id: e.paciente_id,
          },
          tx
        )
        return e
      })
      if (!exam)
        return res.status(404).json({ message: 'Examen físico de orientación no encontrado' })
      res.json(exam)
    } catch (err) {
      console.error('Error al eliminar examen físico de orientación:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al eliminar examen físico de orientación',
      })
    }
  }

  static async update(req, res) {
    const { id } = req.params
    try {
      const updatedExam = await prisma.$transaction(async (tx) => {
        const e = await PhysicalExaminationModel.update(id, req.body, tx)
        if (!e) return null
        await PatientModel.touch(e.paciente_id, tx)
        await AuditModel.create(
          {
            usuario_id: req.session.userId,
            accion: ACCIONES.ACTUALIZAR,
            entidad: ENTIDADES.EXAM_FIS_ORIEN_NUTRICION,
            objetivo_id: e.id,
            paciente_id: e.paciente_id,
          },
          tx
        )
        return e
      })
      if (!updatedExam)
        return res.status(404).json({ message: 'Examen físico de orientación no encontrado' })
      res.json(updatedExam)
    } catch (err) {
      console.error('Error al actualizar examen físico de orientación:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar examen físico de orientación',
      })
    }
  }
}
