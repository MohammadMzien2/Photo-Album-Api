import prisma from "../prisma";
import { CreateUserData, UpdateUserData } from '../types'

/**
 * Get a user by id
 */

export const getUserById = async (id: number) => {
	return await prisma.user.findUnique({
		where: {
			id: id
		}
	})
}

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
		data: data,
	})
}

/**
 * Update a user
 */

export const updateUser = async (userId: number, userData: UpdateUserData) => {
	return await prisma.user.update({
		where: {
			id: userId,
		},
		data: userData,
	})
}
