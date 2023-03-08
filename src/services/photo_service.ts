import prisma from "../prisma";
import { CreatePhotoData, UpdatePhotoData } from '../types'

/**
 * Get all photos
 */
export const getPhotos = async (sub: number) => {
	return await prisma.photo.findMany({
		where: {
			user_id: sub,
		},
		select: {
			id: true,
			title: true,
			url: true,
			comment: true,
		}
	})
}

/**
 * Get a single photo
 */
export const getPhoto = async (photoId: number, sub: number) => {
	return await prisma.photo.findFirstOrThrow({
		where: {
			id: photoId,
			user_id: sub,
		},
		select: {
			id: true,
			title: true,
			url: true,
			comment: true,
		}
	})
}

/**
 * Create a photo
 */
export const createPhoto = async (data: CreatePhotoData) => {
	return await prisma.photo.create({
		data: {
			title: data.title,
			url: data.url,
			comment: data.comment,
			user: { connect: {id: data.user_id}}
		}
	})
}

export const updatePhoto = async (photoId: number, data: UpdatePhotoData) => {
	return await prisma.photo.update({
		where: {
			id: photoId,
		},
		data,
	})
}

export const deletePhoto = async (photoId: number) => {
	return await prisma.photo.delete({
		where: {
			id: photoId,
		},
	})
}
