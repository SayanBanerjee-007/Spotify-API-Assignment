import axios from 'axios'
import { spotifyConfig } from '../config/spotify.config.js'

class SpotifyService {
	async exchangeCodeForTokens(code) {
		const params = new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: spotifyConfig.redirectUri,
		})

		const authHeader = Buffer.from(
			`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`
		).toString('base64')

		const response = await axios.post(
			spotifyConfig.tokenUrl,
			params,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${authHeader}`,
				},
			}
		)

		return {
			accessToken: response.data.access_token,
			refreshToken: response.data.refresh_token,
			expiresIn: response.data.expires_in,
		}
	}

	async refreshAccessToken(refreshToken) {
		if (!refreshToken) {
			throw new Error(
				'No refresh token available. Please authenticate first.'
			)
		}

		const params = new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		})

		const authHeader = Buffer.from(
			`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`
		).toString('base64')

		const response = await axios.post(
			spotifyConfig.tokenUrl,
			params,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${authHeader}`,
				},
			}
		)

		return {
			accessToken: response.data.access_token,
			expiresIn: response.data.expires_in,
		}
	}

	async getTopTracks(limit = 10, accessToken) {
		const response = await axios.get(
			`${spotifyConfig.apiBaseUrl}/me/top/tracks`,
			{
				params: { limit, time_range: 'medium_term' },
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		)

		const data = response.data

		return {
			total: data.items.length,
			tracks: data.items.map(track => ({
				id: track.id,
				name: track.name,
				uri: track.uri,
				artists: track.artists.map(artist => ({
					name: artist.name,
					id: artist.id,
				})),
				album: {
					name: track.album.name,
					images: track.album.images,
					releaseDate: track.album.release_date,
				},
				duration_ms: track.duration_ms,
				popularity: track.popularity,
				preview_url: track.preview_url,
				external_urls: track.external_urls,
			})),
		}
	}

	async getCurrentlyPlaying(accessToken) {
		try {
			const response = await axios.get(
				`${spotifyConfig.apiBaseUrl}/me/player/currently-playing`,
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			)

			const data = response.data

			if (!data || !data.item) {
				return {
					isPlaying: false,
					message: 'No track currently playing',
				}
			}

			return {
				isPlaying: data.is_playing,
				progress_ms: data.progress_ms,
				track: {
					id: data.item.id,
					name: data.item.name,
					uri: data.item.uri,
					artists: data.item.artists.map(artist => ({
						name: artist.name,
						id: artist.id,
					})),
					album: {
						name: data.item.album.name,
						images: data.item.album.images,
					},
					duration_ms: data.item.duration_ms,
					external_urls: data.item.external_urls,
				},
				device: data.device
					? {
							id: data.device.id,
							name: data.device.name,
							type: data.device.type,
					  }
					: null,
			}
		} catch (error) {
			if (error.response?.status === 204) {
				return {
					isPlaying: false,
					message: 'No track currently playing',
				}
			}
			throw error
		}
	}

	async playTrack(trackUri, accessToken) {
		try {
			const devicesResponse = await axios.get(
				`${spotifyConfig.apiBaseUrl}/me/player/devices`,
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			)

			const devices = devicesResponse.data.devices

			if (!devices || devices.length === 0) {
				throw new Error(
					'No active device found. Please open Spotify on a device first.'
				)
			}

			const activeDevice =
				devices.find(d => d.is_active) || devices[0]

			await axios.put(
				`${spotifyConfig.apiBaseUrl}/me/player/play`,
				{
					uris: [trackUri],
					device_id: activeDevice.id,
				},
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			)

			return {
				success: true,
				message: 'Track started playing',
				device: {
					name: activeDevice.name,
					type: activeDevice.type,
				},
			}
		} catch (error) {
			if (
				error.response?.data?.error?.reason === 'PREMIUM_REQUIRED' ||
				error.response?.status === 403
			) {
				throw new Error(
					'Spotify Premium required for playback control. This feature is only available to Premium subscribers.'
				)
			}

			if (error.response?.status === 404) {
				throw new Error(
					'No active device found. Please open Spotify on a device.'
				)
			}

			throw new Error(
				error.response?.data?.error?.message ||
					error.message ||
					'Failed to play track'
			)
		}
	}

	async pausePlayback(accessToken) {
		try {
			await axios.put(
				`${spotifyConfig.apiBaseUrl}/me/player/pause`,
				{},
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			)
			return { success: true, message: 'Playback paused' }
		} catch (error) {
			if (
				error.response?.data?.error?.reason === 'PREMIUM_REQUIRED' ||
				error.response?.status === 403
			) {
				throw new Error(
					'Spotify Premium required for playback control. This feature is only available to Premium subscribers.'
				)
			}

			if (error.response?.status === 404) {
				throw new Error(
					'No active device found. Please open Spotify on a device.'
				)
			}

			throw new Error(
				error.response?.data?.error?.message ||
					error.message ||
					'Failed to pause playback'
			)
		}
	}

	async getUserProfile(accessToken) {
		const response = await axios.get(
			`${spotifyConfig.apiBaseUrl}/me`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		)

		const data = response.data

		return {
			id: data.id,
			display_name: data.display_name,
			email: data.email,
			country: data.country,
			product: data.product,
			images: data.images,
			external_urls: data.external_urls,
		}
	}
}

export default new SpotifyService()
