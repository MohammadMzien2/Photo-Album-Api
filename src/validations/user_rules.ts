import { body } from 'express-validator'
import { getUserByEmail } from '../services/user_service'


export const createUserRules = [
	body('email').isEmail().custom(async value => {
			const user = await getUserByEmail(value)

			if (user) {
				return Promise.reject("Email must be unique")
			}
		}),

	body('password').isString().trim().isLength({ min: 6 }),
	body('first_name').isString().trim().bail().isLength({ min: 2 }),

	body('last_name').isString().trim().bail().isLength({ min: 2 })

]
