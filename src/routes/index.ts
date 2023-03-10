import albums from './albums'
import photos from './photos'
import express from 'express'
import { validateToken } from '../middlewares/auth/jwt'
import { login, refresh, register } from '../controllers/user_controller'
import { createUserRules, loginUserRules } from '../validations/user_rules'

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
router.use('/albums', validateToken, albums)

/**
 * photos from user
 */
router.use('/photos', validateToken, photos)

/**
 * POST/ login to profile
 */
router.post('/login', loginUserRules, login)

/**
 * POST/ refresh the profile login
 */
router.post('/refresh', refresh)

/**
 * POST /register a profile
 */

router.post('/register', createUserRules, register)

export default router
