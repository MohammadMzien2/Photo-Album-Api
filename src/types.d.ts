
export type connectPhotosData = {
	id: number,
}

export type CreatePhotoData = {
	title: string,
	url: string,
	comment?: string,
	user_id: number,
}

export type CreateAlbumData = {
	title: string,
	user_id: number,
}

export type CreateUserData = {
	first_name: string,
	last_name: string,
	email: string,
	password: string,
}

export type JwtPayload = {
	sub: number,
	email: string,
	iat?: number,
	exp?: number,
}

export type UpdateAlbumData = {
	title?: string,
}

export type UpdatePhotoData = {
	title?: string,
	url?: string,
	comment?: string,
}

export type UpdateUserData = {
	name?: string,
	email?: string,
	password?: string,
}
