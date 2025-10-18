import spotifyService from '../services/spotify.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const requireAuth = async (req, res, next) => {
	try {
		let accessToken = req.cookies.spotify_access_token
		const refreshToken = req.cookies.spotify_refresh_token

		if (!refreshToken) {
			return res
				.status(401)
				.json(
					new ApiResponse(
						401,
						null,
						'Not authenticated. Please visit /auth/login to authenticate.'
					)
				)
		}

		if (!accessToken) {
			console.log(
				'[AUTH] Access token expired or missing, refreshing...'
			)

			const tokens = await spotifyService.refreshAccessToken(
				refreshToken
			)
			accessToken = tokens.accessToken

			res.cookie('spotify_access_token', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: tokens.expiresIn * 1000,
				sameSite: 'lax',
			})

			console.log('[AUTH] ✅ Token refreshed successfully')
		}

		req.accessToken = accessToken
		req.refreshToken = refreshToken
		next()
	} catch (error) {
		return res
			.status(401)
			.json(
				new ApiResponse(
					401,
					null,
					error.message ||
						'Authentication failed. Please visit /auth/login to re-authenticate.'
				)
			)
	}
}
