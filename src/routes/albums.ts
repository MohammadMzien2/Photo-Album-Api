import express from 'express'
import { createAlbumRules, updateAlbumRules } from '../validations/album_rules'
import { index, show, store, update } from '../controllers/album_controller'
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
router.post('/', createAlbumRules, store)

/**
 * PATCH/ albums/:albumId
 * Update an album
 */
router.patch('/:albumId', updateAlbumRules, update)

export default router
