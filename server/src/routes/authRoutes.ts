import { Router } from 'express'
import rateLimit from 'express-rate-limit'

import * as authController from '../controllers/authController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/auth'

const router = Router()

// Auth endpoints get a tighter limit than the global one
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/register', authLimiter, asyncHandler(authController.register))
router.post('/login', authLimiter, asyncHandler(authController.login))
router.post('/refresh', authLimiter, asyncHandler(authController.refresh))
router.post('/logout', asyncHandler(authController.logout))
router.get('/me', requireAuth, asyncHandler(authController.me))

export default router