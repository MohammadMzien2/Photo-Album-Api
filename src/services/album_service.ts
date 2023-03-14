import prisma from "../prisma";
import { CreateAlbumData } from '../types'

/**
 * Get all albums
 */
export const getAlbums = async (userId: number) => {
	return await prisma.album.findMany(
		{
			where: {
				user_id: userId
			}
		}
	)
}

/**
 * Get a single album
 */
export const getAlbum = async (albumId: number) => {
	return await prisma.album.findFirstOrThrow({
		where: {
			id: albumId
		},
		select: {
			id: true,
			title: true,
			photos: true,
			user_id: true,
		}
	})
}


/**
 * Post albums
 */
export const createAlbum = async (data: CreateAlbumData) => {
	return await prisma.album.create({
		data: {
			title: data.title,
			user: {
				connect: {
					id: data.user_id
				}
			}
		}
	})
}
