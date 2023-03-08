import express from 'express'
import { createPhotoRules, updatePhotoRules } from '../validations/photo_rules'
import { index, show, store, update } from '../controllers/photo_controller'
import { validateToken } from '../middlewares/auth/jwt'
const router = express.Router()

/**
 * GET /photos
 * Get all photos
 */
router.get('/', index)

/**
 * GET/photos/:photoId
 * Get a single photo
 */
router.get('/:photoId', show)

/**
 * POST /photo
 * Create a new photo
 */
router.post('/', createPhotoRules, store)

/**
 * PATCH/ photo/:photoId
 * Update a photo
 */
router.patch('/:photoId', updatePhotoRules, update)

export default router
