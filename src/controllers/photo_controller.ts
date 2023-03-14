import Debug from 'debug'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { getPhoto, getPhotos, createPhoto } from '../services/photo_service'
import prisma from '../prisma'

// Create a new debug
const debug = Debug('REST-API-fotoapp:photo_controller')

/**
 * Get all photos
 */
export const index = async (req: Request, res: Response) => {
	const userId = Number(req.user!.id)

	try{
		const photo = await getPhotos(userId)

		res.status(200).send({
			status: "success",
			data: photo,
		})
	}catch(err) {
		res.status(500).send({
			status: "error",
			message: "Something went wrong"
		})
	}
}

/**
 * Get single photo
 */
export const show = async (req: Request, res: Response) => {
	const photoId = Number(req.params.photoId)

	try{
		const photo = await getPhoto(photoId)
		if(Number(photo.user_id) !== Number(req.user!.id)){
			res.status(403).send({
				status: "error",
				message: "Not your photo"
			})
		} else if(Number(photo.user_id) === Number(req.user!.id)){
			res.status(200).send({
				status: "success",
				data: photo
			})
		}
	} catch(err){
		res.status(404).send({
			message: "Not found",
		})
	}
}

/**
 * Post photos
 */
export const store = async (req: Request, res: Response) => {
	const validationErros = validationResult(req)
	if(!validationErros.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErros.array()
		})
	}try{
		const photo = await createPhoto({
			title: req.body.title,
			url: req.body.url,
			comment: req.body.comment,
			user_id: req.user!.id
		})
		res.status(200).send({
			status: "success",
			data: photo
		})
	}catch(err){
		res.status(500).send({
			status: "error",
			message: "Something went wrong"
		})
	}
}

/**
 * PATCH update photo
 */
export const update = async (req: Request, res: Response) => {
	const photoId = Number(req.params.photoId)

	try{
		const photo = await prisma.photo.update({
			where: {
				id: photoId
			},
			data: req.body
		})
		return res.status(200).send(photo)
	}catch(err) {
		return res.status(500).send({
			status: "error",
			message: "Didn't work"
		})
	}

	}

