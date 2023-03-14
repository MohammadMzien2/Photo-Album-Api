import express from "express";
import { getUser } from '../controllers/user_controller'
const router = express.Router()

/**
 * GET /resource
 */
router.get('/', getUser)


export default router
