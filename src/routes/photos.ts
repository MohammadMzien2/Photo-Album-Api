import express from 'express'
import { index, show, store, update } from '../controllers/photo_controller'
import { body } from 'express-validator'
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
router.post('/', [
	body('title').isString().bail().trim().isLength({ min: 3 }),
	body('url').isURL().trim(),
	body('comment').optional().isString().bail().isLength({ min: 3 })
], store)

/**
 * PATCH/ photo/:photoId
 * Update a photo
 */
router.patch('/:photoId', [
body('title').isString().bail().trim().isLength({ min: 3 }),
body('url').isURL().trim(),
body('comment').isString().trim().bail().isLength({ min: 3 })
], update)

export default router
