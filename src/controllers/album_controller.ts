import Debug from 'debug'
import { Request, Response } from 'express'
import { connectPhotos, createAlbum, deleteAlbum, getAlbum, getAlbums, removePhoto, updateAlbum } from '../services/album_service'
import { matchedData, validationResult } from 'express-validator'
import { getPhoto, getPhotos } from '../services/photo_service'


// Create a new debug
const debug = Debug('REST-API-fotoapp:album_controller')

/**
 * Get all albums
 */
export const index = async (req: Request, res: Response) => {
	try {
		const albums = await getAlbums(req.token!.sub)

		res.send({
			status: "success",
			data: albums,
		})
	} catch (err) {
		debug("Error thrown when finding albums", err)
		res.status(500).send({ status: "error", message: "Something went wrong" })
	}
}

/**
 * Get a single album
 */
export const show = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId)

	try {
		const album = await getAlbum(albumId, req.token!.sub)

		res.send({
			status: "success",
			data: album,
		})
	} catch (err) {
		debug("Error thrown when finding albums o%", req.params.albumId, err)
		return res.status(404).send({ status: "error", message: "Don't found" })
	}
}

/**
 * Create an album
 */
export const store = async (req: Request, res: Response) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
	}
	// Get only the validated data for the request
	const validatedData = matchedData(req)
	try {
		const album = await createAlbum({
			title: validatedData.title,
			user_id: req.token!.sub,
		})
		res.send({
			status: "success",
			data: album,
		})
	} catch (err) {
		debug("Error thrown when creating an album o%", req.params.albumId, err)
		return res.status(404).send({ status: "error", message: "Don't found" })
	}
}

/**
 * Update an album
 */
export const update = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId)

	//Check validation error
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array()
		})
	}

	// Get only validated data from the request
	const validatedData = matchedData(req)
	try {
		const foundAlbum = await getAlbum(albumId, req.token!.sub)

		const album = await updateAlbum(foundAlbum.id, validatedData)

		res.send({
			status: "success",
			data: album,
		})
	} catch (err) {
		debug("Error thrown when updating album o%", req.params.albumId, err)
		return res.status(404).send({ status: "error", message: "Don't found" })
	}
}

/**
 * Add several photos to an album
 */
export const addToAlbum = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId)

	//Check validation errors
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
	}

	//Get the validated date from request
	const validatedData = matchedData(req)
	debug('the validated data:', validatedData)

	try {
		const foundAlbum = await getAlbum(albumId, req.token!.sub)

		const usersPhotos = await getPhotos(req.token!.sub)

		const allPhotosIncluded = validatedData.photo_id.every((photoId: number) => {
			return usersPhotos.find(userPhoto => userPhoto.id === photoId) !== undefined
		})

		//if not
		if (!allPhotosIncluded) {
			return res.status(400).send({
				status: "fail",
				message: "one or more photo_id don't exist"
			})
		}
		//if all photos_id exist
		const photoIds = validatedData.photo_id.map((photoId: Number) => {
			return {
				id: photoId,
			}
		})

		// connecting photos to album
		await connectPhotos(foundAlbum.id, photoIds)

		res.send({
			status: "success",
			data: null,
		})
	} catch (err) {
		debug("Error thrown when updating album o%", req.params.albumId, err)
		return res.status(404).send({ status: "error", message: "Don't found" })
	}
}

/**
 * Delete a photo from an album
 */
export const remove = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId)
	const photoId = Number(req.params.photoId)

	try {
		const foundAlbum = await getAlbum(albumId, req.token!.sub)
		const foudnPhoto = await getPhoto(photoId, req.token!.sub)
		await removePhoto(foundAlbum.id, foudnPhoto.id)

		res.send({
			status: "success",
			data: null
		})
	} catch (err) {
		debug("Error thrown when deleting photo o%", photoId, albumId, err)
		return res.status(404).send({ status: "error", message: "Don't found" })
	}
}

/**
 * Delete an albums
 */
export const destroy = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId)

	try {
		const foundAlbumId = await getAlbum(albumId, req.token!.sub)
		await deleteAlbum(foundAlbumId.id)

		res.send({
			status: "success",
			data: null,
		})
	} catch (err) {
		debug("Error thrown when deleting album o%", albumId, err)
		return res.status(404).send({ status: "error", message: "Don't found" })
	}
}
