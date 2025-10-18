import { spotifyConfig } from '../config/spotify.config.js'
import spotifyService from '../services/spotify.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { generateRandomString } from '../utils/randomString.js'
import { stateStore } from '../utils/stateStore.js'

export const login = asyncHandler(async (req, res) => {
	const scopes = spotifyConfig.scopes.join(' ')
	const state = generateRandomString(16)

	// Store state for CSRF protection (optional: add metadata like IP, userAgent)
	stateStore.set(state)

	const authUrl = new URL(spotifyConfig.authUrl)
	authUrl.searchParams.append('client_id', spotifyConfig.clientId)
	authUrl.searchParams.append('response_type', 'code')
	authUrl.searchParams.append(
		'redirect_uri',
		spotifyConfig.redirectUri
	)
	authUrl.searchParams.append('scope', scopes)
	authUrl.searchParams.append('state', state)

	res.redirect(authUrl.toString())
})

export const callback = asyncHandler(async (req, res) => {
	const { code, error, state } = req.query

	if (error) {
		throw new ApiError(400, 'Authorization failed', [error])
	}

	if (!code) {
		throw new ApiError(400, 'No authorization code provided')
	}

	if (!state || !stateStore.has(state)) {
		throw new ApiError(
			403,
			'Invalid state parameter - possible CSRF attack'
		)
	}

	stateStore.delete(state)

	const tokens = await spotifyService.exchangeCodeForTokens(code)
	console.log('auth successful')

	// Set access token cookie (browser auto-deletes after expiresIn)
	res.cookie('spotify_access_token', tokens.accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: tokens.expiresIn * 1000,
		sameSite: 'lax',
	})

	// Set refresh token cookie (long-lived, 1 year)
	res.cookie('spotify_refresh_token', tokens.refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 365 * 24 * 60 * 60 * 1000,
		sameSite: 'lax',
	})

	res.status(200).json(
		new ApiResponse(
			200,
			{
				info: 'You can now access /spotify endpoints',
				expiresIn: tokens.expiresIn,
			},
			'Authorization successful! Tokens saved to cookies.'
		)
	)
})

export const status = asyncHandler(async (req, res) => {
	const refreshToken = req.cookies.spotify_refresh_token

	if (!refreshToken) {
		throw new ApiError(
			401,
			'No refresh token found. Please visit /auth/login to authenticate.'
		)
	}

	const tokenData = await spotifyService.refreshAccessToken(
		refreshToken
	)
	const profile = await spotifyService.getUserProfile(
		tokenData.accessToken
	)

	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ user: profile },
				'Successfully authenticated with Spotify'
			)
		)
})
