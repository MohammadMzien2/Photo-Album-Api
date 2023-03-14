import albums from './albums'
import photos from './photos'
import user from './users'
import express from 'express'
import { basic } from '../middlewares/auth/basic'
import { register } from '../controllers/user_controller'
import { createUserRules } from '../validations/user_rules'

//Instantiate a new router
const router = express.Router()

/**
 * GET /
 */
router.get('/', (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP",
	})
})

/**
 * albums of photos
 */
router.use('/albums', basic, albums)

/**
 * photos from user
 */
router.use('/photos', basic, photos)

/**
 * POST /register a profile
 */

router.post('/register', createUserRules, register)

export default router
