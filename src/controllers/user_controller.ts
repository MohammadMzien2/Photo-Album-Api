import bcrypt from 'bcrypt'
import Debug from 'debug'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import prisma from '../prisma'
import { createUser, getUserByEmail } from '../services/user_service'

// Create a new debug
const debug = Debug('REST-API-fotoapp:user_controller')


/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
	}

	// Get only the validated data
	const validatedData = matchedData(req)

	// calulate hash + salt
	const hasedPassword = await bcrypt.hash(validatedData.password, Number(process.env.SALT_ROUNDS)|| 10)

	validatedData.password = hasedPassword

	try{
		const user = await createUser({
			first_name: validatedData.first_name,
			last_name: validatedData.last_name,
			email: validatedData.email,
			password: hasedPassword
		})
		res.status(200).send({
			"status": "success",
			"data": user
		})
	} catch(err) {
		return res.status(500).send({
			"status": "error",
			message: "Could not create user"
		})
	}
}

/**
 * Get user
 */

export const getUser = async (req: Request, res: Response) => {
	const user = await getUserByEmail(req.user!.email)
	res.status(200).send({
		"status": "success",
		data:{
			id: user?.id,
			first_name: user?.first_name,
			last_name: user?.last_name,
			email: user?.email

		}
	})
}
