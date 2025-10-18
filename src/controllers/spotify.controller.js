import spotifyService from '../services/spotify.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'

export const getSpotifyData = asyncHandler(async (req, res) => {
	const [topTracks, currentlyPlaying] = await Promise.all([
		spotifyService.getTopTracks(10, req.accessToken),
		spotifyService.getCurrentlyPlaying(req.accessToken),
	])

	res.status(200).json(
		new ApiResponse(
			200,
			{
				topTracks,
				currentlyPlaying,
				timestamp: new Date().toISOString(),
			},
			'Data fetched successfully'
		)
	)
})

export const playTrack = asyncHandler(async (req, res) => {
	const { uri, id } = req.body

	if (!uri && !id) {
		throw new ApiError(400, 'Please provide either "uri" or "id"')
	}

	const trackUri = uri || `spotify:track:${id}`

	if (!trackUri.startsWith('spotify:track:')) {
		throw new ApiError(
			400,
			'URI must be in format: spotify:track:xxx'
		)
	}

	const result = await spotifyService.playTrack(
		trackUri,
		req.accessToken
	)

	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ device: result.device, trackUri },
				result.message
			)
		)
})

export const stopPlayback = asyncHandler(async (req, res) => {
	console.log('hello')
	const result = await spotifyService.pausePlayback(req.accessToken)

	res.status(200).json(new ApiResponse(200, null, result.message))
})

export const getTopTracks = asyncHandler(async (req, res) => {
	const limit = parseInt(req.query.limit) || 10

	if (limit < 1 || limit > 50) {
		throw new ApiError(400, 'Limit must be between 1 and 50')
	}

	const topTracks = await spotifyService.getTopTracks(
		limit,
		req.accessToken
	)

	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				topTracks,
				'Top tracks fetched successfully'
			)
		)
})

export const getNowPlaying = asyncHandler(async (req, res) => {
	const currentlyPlaying = await spotifyService.getCurrentlyPlaying(
		req.accessToken
	)

	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				currentlyPlaying,
				'Currently playing track fetched successfully'
			)
		)
})
