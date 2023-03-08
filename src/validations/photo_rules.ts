import { body } from 'express-validator'
import Debug from 'debug'

//Create a new debug
const debug = Debug('REST-API-fotoapp:photo_rules')

export const createPhotoRules = [
	body('title').trim().exists()
	.withMessage('title is requied').bail()
	.isString().withMessage('title has to be letters or numbers')
	.bail().isLength({ min: 3 }).withMessage('title must be at least 3 chars long'),

	body('url').trim().exists()
	.withMessage('URL is requied').bail()
	.isURL().withMessage('URL has to be a valid URL-adress'),

	body('comment').trim().optional().isString()
	.withMessage('comment must be chars').bail()
	.isLength({ min: 3 }).withMessage('comment must be at least 3 chars long'),


]



export const updatePhotoRules = [
	body('title').trim().optional().isString()
	.withMessage('title has to be letters or numbers')
	.bail().isLength({ min: 3 }).withMessage('title must be at least 3 chars long'),

	body('url').trim().optional().isURL()
	.withMessage('URL has to be a valid URL-adress'),


	body('comment').trim().optional().isString()
	.withMessage('comment must be chars').bail()
	.isLength({ min: 3 }).withMessage('comment must be at least 3 chars long'),

]
