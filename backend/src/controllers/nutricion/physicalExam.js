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

    const result = await PhysicalExaminationModel.getAll({
      paciente_id,
      page,
      limit,
      fields: parsedFields,
    })
    return res.json(result)
  }

  static async getById(req, res) {
    const { id } = req.params
    const exam = await PhysicalExaminationModel.getById(id)
    return res.json(exam)
  }

  static async delete(req, res) {
    const { id } = req.params
    const exam = await prisma.$transaction(async (tx) => {
      const e = await PhysicalExaminationModel.delete(id, tx)
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
    res.json(exam)
  }

  static async update(req, res) {
    const { id } = req.params
    const updatedExam = await prisma.$transaction(async (tx) => {
      const e = await PhysicalExaminationModel.update(id, req.body, tx)
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
    res.json(updatedExam)
  }
}
