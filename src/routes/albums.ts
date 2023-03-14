import express from 'express'
import { body } from 'express-validator'
import { basic } from '../middlewares/auth/basic'
import { index, show, store, update, addPhoto } from '../controllers/album_controller'
const router = express.Router()

/**
 * Get all albums
 * GET/ albums
 */
router.get('/', index)

/**
 * GET a single album
 * GET/ albums/:albumId
 */
router.get('/:albumId', show)

/**
 * Create a new album
 * POST/albums
 */
router.post('/', [
	body('title').isString().trim().bail().isLength({ min: 3 })
], store)


/**
 * Post photo to album
 */
router.post('/:albumId/photos', addPhoto)


/**
 * PATCH/ albums/:albumId
 * Update an album
 */
router.patch('/:albumId', [
    body('title').isString().bail().trim().isLength({ min: 3 })
], basic, update)




export default router
