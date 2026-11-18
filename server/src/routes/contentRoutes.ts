import { Router } from 'express'

import * as contentController from '../controllers/contentController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

router.get('/topics', asyncHandler(contentController.listTopics))
router.get('/topics/:slug', asyncHandler(contentController.getTopic))
router.get('/questions', asyncHandler(contentController.listQuestions))

export default router