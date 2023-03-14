import Debug from 'debug'
import { Request, Response } from 'express'
import { getPhoto } from '../services/photo_service'
import { validationResult } from 'express-validator'
import { createAlbum, getAlbum, getAlbums } from '../services/album_service'
import prisma from '../prisma'

// Create a new debug
const debug = Debug('REST-API-fotoapp:album_controller')

/**
 * Get all albums
 */
export const index = async (req: Request, res: Response) => {
	const userId = Number(req.user!.id)

	try{
		const album = await getAlbums(userId)

		res.status(200).send({
			status: "success",
			data: album,
		})
	}catch(err){
		debug("Error thrown when finding albums: %o, user: %o:")
		res.status(500).send({
			status: "error",
			message: "Something went wrong"
		})
	}
}

/**
 * Get single album
 */
export const show = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId)

	try{
		const album = await getAlbum(albumId)

		if(Number(album.user_id) !== Number(req.user!.id)){
			res.status(403).send({
				status: "error",
				message: "Dont found"
			})
		}else if(Number(album.user_id) === Number(req.user!.id)) {
			res.status(200).send({
				status: "success",
				data: album
			})
		}
	}catch(err){
		debug("Error thrown finding albumId %o", albumId)
		res.status(404).send({
			status: "error",
			message: "Dont found",
		})
	}
}

/**
 * POST albums
 */

export const store = async(req: Request, res: Response) => {
	const validationErrors = validationResult(req)
	if(!validationErrors.isEmpty()){
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
	}
	try{
		const album = await createAlbum({
			title: req.body.title,
			user_id: req.user!.id
		})
		res.status(200).send({
			status: "success",
			data: album
		})
	}catch(err){
		res.status(500).send({
			status: "error",
			message: "Something went wrong"
		})
	}
}
/**
 * Link a photo to an user album
 */
export const addPhoto = async(req: Request, res: Response) => {
	const photo_id = Number(req.body.photo_id)
	const albumId = Number(req.params.albumId)

	const photo = await getPhoto(photo_id)
	const album = await getAlbum(albumId)

	if(Number(req.user!.id) !== album.user_id){
		debug("Photos userid: %o, album userId: %o", photo.user_id, album.user_id)
		return res.status(400).send({
			status: "error",
			message: "Dont found"
		})
	}
	if(Number(req.user!.id) !== photo.user_id) {
		return res.status(400).send({
			status: "error",
			message: "Dont found"
		})
	}

	try{
		const result = await prisma.album.update({
			where: {
				id: Number(req.params.albumId)
			},
			data: {
				photos:{
					connect:{
						id: req.body.photo_id,
					}
				}
			},
			include: {
				photos: true
			}
		})
		return res.status(200).send({
			status: "success",
			data: result
		})
	}catch(err){
		return res.status(500).send({
			status: "error",
			message: "Something went wrong"
		})
	}
}

/**
 * PATCH update album
 */
export const update = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId)

	try{
		const album = await prisma.album.update({
			where: {
				id: albumId
			},
			data: req.body
		})
		return res.status(200).send(album)
	}catch(err){
		return res.status(500).send({
			status: "error",
			message: "Didnt work"
		})
	}
}
