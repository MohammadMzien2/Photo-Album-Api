import prisma from "../prisma";
import { CreatePhotoData } from '../types'

/**
 * Get all photos
 */
export const getPhotos = async (userId: number) => {
	return await prisma.photo.findMany(
		{
			where: {
				user_id: userId
			}
		}
	)
}

/**
 * Get a single photo
 */
export const getPhoto = async (photoId: number) => {
	return await prisma.photo.findFirstOrThrow({
		where: {
			id: photoId
		},
		select: {
			id: true,
			title: true,
			url: true,
			comment: true,
			user_id: true,

		}
	})
}

/**
 * Post photos
 */
export const createPhoto = async (data: CreatePhotoData) => {
	return await prisma.photo.create({
		data: {
			title: data.title,
			url: data.url,
			comment: data.comment,
			user: {
				connect: {
					id: data.user_id
				}
			}
		}
	})
}
