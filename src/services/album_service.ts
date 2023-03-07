import prisma from "../prisma";
import { connectPhotosData, CreateAlbumData, CreatePhotoData, UpdateAlbumData, UpdatePhotoData } from '../types'

/**
 * Get all albums
 */
export const getAlbums = async (sub: number) => {
	return await prisma.album.findMany({
		where: {
			user_id: sub,
		},
		select: {
			id: true,
			title: true,
			user_id: true,
		}
	})
}

/**
 * Get a single album
 */

export const getAlbum = async (albumId: number, sub: number) => {
	return await prisma.album.findFirstOrThrow({
		where: {
			id: albumId,
			user_id: sub,
		},
		select: {
			id: true,
			title: true,
			photos: true,
		},
	})
}

/**
 * Create an album
 */
export const createAlbum = async (data: CreateAlbumData) => {
	return await prisma.album.create({
		data: {
			title: data.title,
			user: { connect: { id: data.user_id } }
		}
	})
}

/**
 * Update an album
 */

export const updateAlbum = async (albumId: number, data: UpdateAlbumData) => {
	return await prisma.album.update({
		where: {
			id: albumId
		},
		data
	})
}

/**
 * Add a photo to an album
 */

export const connectPhotos = async (albumId: number, photoIds: connectPhotosData) => {
	return await prisma.album.update({
		where: {
			id: albumId
		},
		data: {
			photos: {
				connect: photoIds,
			}
		},
	})
}

/**
 * Reomve a photo from an album
 */
export const removePhoto = async (albumId: number, photoId: number) => {
	return await prisma.album.update({
		where: {
			id: albumId,
		},
		data: {
			photos: {disconnect: {id: photoId}}
		}
	})
}

/**
 *
 */
export const deleteAlbum = async (albumId:  number) => {
	return await prisma.album.delete({
		where: {
			id: albumId,
		},
	})
}
