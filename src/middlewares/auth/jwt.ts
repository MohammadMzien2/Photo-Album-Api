import Debug from "debug";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../types";

const debug = Debug('prisma-books:jwt')

/**
 * validate jwt access token
 */
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
	debug("hello from auth/jwt")


if (!req.headers.authorization) {
	debug("Authorization header missing")

	return res.status(401).send({
		status: "fail",
		data: "Authorization required",
	})
}

const [authSchema, token] = req.headers.authorization.split(" ")

if (authSchema.toLowerCase() !== "bearer") {
	debug("Authorization schema isn't bearer")

	return res.status(401).send({
		status: "fail",
		data: "Authorization Required"
	})
}

try {
	const payload = (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as unknown) as JwtPayload
	debug("yay got o%", payload)

	req.token = payload

} catch (err) {
	debug("token failed verifiication", err)

	return res.status(401).send({
		status: "fail",
		data: "Authorization Required"
	})
}

next()

}
