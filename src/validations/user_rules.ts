import { body } from 'express-validator'
import { getUserByEmail } from '../services/user_service'
import Debug from 'debug'

//Create a new debug
const debug = Debug('REST-API-fotoapp:user_rules')

export const createUserRules = [
	body('email').trim().exists()
		.withMessage('email is requied').bail()
		.isEmail().withMessage('email has to be a valid email-adress')
		.bail().custom(async (value: string) => {
			const user = await getUserByEmail(value)

			if (user) {
				return Promise.reject("Email must be unique")
			}
		}),

	body('password').trim().exists()
		.withMessage('password is requied').bail()
		.isString().withMessage('password has to be letters or numbers')
		.bail().isLength({ min: 6 }).withMessage('password must be at least 6 chars long'),

	body('fist_name').trim().exists()
		.withMessage('fist_name is requied').bail()
		.isString().withMessage('fist_name has to be letters or numbers')
		.bail().isLength({ min: 3 }).withMessage('fist_name must be at least 3 chars long'),


	body('last_name').trim().exists()
		.withMessage('last_name is requied').bail()
		.isString().withMessage('last_name has to be letters or numbers')
		.bail().isLength({ min: 3 }).withMessage('last_name must be at least 3 chars long'),

]


export const loginUserRules = [
	body('email').trim().exists()
		.withMessage('email is requied').bail()
		.isEmail().withMessage('email has to be a valid email-adress')
		.bail().custom(async (value: string) => {
			const user = await getUserByEmail(value)

			if (!user) {
				return Promise.reject("there's no user with that email-adress")
			}
		}),

	body('password').trim().exists()
		.withMessage('password is requied').bail()
		.isString().withMessage('password has to be letters or numbers')
		.bail().isLength({ min: 6 }).withMessage('password must be at least 6 chars long'),

]

export const updateUserRules = [
	body('email').trim().optional().isEmail()
		.withMessage('email has to be a valid email-adress')
		.bail().custom(async (value: string) => {
			const user = await getUserByEmail(value)

			if (user) {
				return Promise.reject("Email must be unique but is already connected to a user")
			}
		}),

	body('password').trim().optional().isString()
		.withMessage('password has to be letters or numbers')
		.bail().isLength({ min: 6 }).withMessage('password must be at least 6 chars long'),



	body('fist_name').trim().optional()
		.isString().withMessage('fist_name has to be letters or numbers')
		.bail().isLength({ min: 3 }).withMessage('fist_name must be at least 3 chars long'),


	body('last_name').trim().optional()
		.isString().withMessage('last_name has to be letters or numbers')
		.bail().isLength({ min: 3 }).withMessage('last_name must be at least 3 chars long'),

]
