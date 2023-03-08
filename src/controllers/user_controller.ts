import bcrypt from 'bcrypt'
import Debug from 'debug'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types'
import { createUser, getUserByEmail } from '../services/user_service'

// Create a new debug
const debug = Debug('REST-API-fotoapp:user_controller')


/**
 * Login a user
 */
export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body

	//find user with email
	const user = await getUserByEmail(email)
	if (!user) {
		return res.status(401).send({
			status: "fail",
			message: "can't find any user with this email.",
		})
	}
	// verify credentials against hash,
	const result = await bcrypt.compare(password, user.password)
	if (!result) {
		return res.status(401).send({
			status: "fail",
			message: "Wrong password",
		})
	}

	//JwtPayLoad
	const payload: JwtPayload = {
		sub: user.id,
		email: user.email,
	}

	//sign payload with access-token secret
	if (!process.env.ACCESS_TOKEN_SECRET) {
		return res.status(500).send({
			status: "error",
			message: "No access token secret"
		})
	}
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '4H',
	})

	//sign payload with refresh token secret
	if (!process.env.REFRESH_TOKEN_SECRET) {
		return res.status(500).send({
			status: "error",
			message: "No refresh token secret",
		})
	}
	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIEM || '1d',
	})
	//respond with access and refresh token
	res.send({
		status: "success",
		data: {
			access_token,
			refresh_token,
		}
	})
}

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

	// Get only the validated data from request
	const validatedData = matchedData(req)

	// Calculate a hash + salt for the password
	const hashPassword = await bcrypt.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10)

	// Replace password with hashed password
	validatedData.password = hashPassword

	// Store the user in the database
	try {
		const user = await createUser({
			email: validatedData.email,
			password: validatedData.password,
			first_name: validatedData.first_name,
			last_name: validatedData.last_name,
		})

		// Respone with 201 create and success
		res.status(201).send({
			status: "success",
			data: {
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
			}
		})
	} catch (err) {
		return res.status(500).send({ status: "error", message: "Can't create in the database" })
	}
}

/**
 * Refersh token
 */
export const refresh = (req: Request, res: Response) => {
	if (!req.headers.authorization) {
		debug("Authorization header missing")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	const [authSchema, token] = req.headers.authorization.split(" ")

	if (authSchema.toLocaleLowerCase() !== "bearer") {
		debug("Authorization schema isn't Bearer")

	return res.status(401).send({
		status: "fail",
		data: "Authorization required",
	})
	}
// Verify refresh token and get refresh token payload
try {
	const payload = (jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "") as unknown) as JwtPayload

	// Remove `iat` and `exp` from payload
	delete payload.iat
	delete payload.exp

	// issue a new access token
	if (!process.env.ACCESS_TOKEN_SECRET) {
		return res.status(500).send({
			status: "error",
			message: "No access token secret",
		})
	}
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '4h',
	})

	// Respond with new access token
	res.send({
		status: "success",
		data: {
			access_token,
		},
	})

} catch (err) {
	debug("token failed verification", err)

	return res.status(401).send({
		status: "fail",
		data: "Authorization required",
	})
}
}
