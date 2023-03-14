import prisma from "../prisma";
import { CreateUserData } from '../types'

/**
 * Get a user by email
 */

export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email: email,
		}
	})
}

/**
 * Create a user
 */
export const createUser = async (data: CreateUserData) => {
	return await prisma.user.create({
		data: data
	})
}
