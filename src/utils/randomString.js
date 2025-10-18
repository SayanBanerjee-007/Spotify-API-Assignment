import crypto from 'crypto'

export const generateRandomString = length => {
	return crypto
		.randomBytes(Math.ceil(length * 0.75))
		.toString('base64url')
		.slice(0, length)
}
