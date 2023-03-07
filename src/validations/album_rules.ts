import { body } from 'express-validator'
import { getAlbum } from '../services/album_service'
import { Request } from 'express'

export const createAlbumRules = [
	body('title').trim().exists()
		.withMessage('title is requied').bail()
		.isString().withMessage('title has to be letters or numbers')
		.bail().isLength({ min: 3 }).withMessage('title must be at least 3 chars long')
]




export const updateAlbumRules = [
	body('title').trim().exists()
	.withMessage('title is requied').bail()
	.isString().withMessage('title has to be letters or numbers')
	.bail().isLength({ min: 3 }).withMessage('title must be at least 3 chars long')


]


export const connectPhotosRules = [
	body('photo_id').exists()
		.withMessage('photo_id is required').bail()
		.isArray().withMessage('this must be an array')
		.bail().withMessage('photo_id must be an array of numbers')

]
