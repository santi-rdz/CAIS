import { Router } from 'express'
import { EvolutionNoteController } from '#controllers/medicina/evolutionNotes.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam } from '#middleware/validate.js'
import {
  validateEvolutionNote,
  validatePartialEvolutionNote,
} from '@cais/shared/schemas/medicina/evolutionNote'

export const evolutionNotesRouter = Router()

evolutionNotesRouter.use(requireAuth)

evolutionNotesRouter
  .route('/')
  .get(EvolutionNoteController.getAll)
  .post(validate(validateEvolutionNote), EvolutionNoteController.create)

evolutionNotesRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(EvolutionNoteController.getById)
  .patch(validate(validatePartialEvolutionNote), EvolutionNoteController.update)
  .delete(EvolutionNoteController.delete)
