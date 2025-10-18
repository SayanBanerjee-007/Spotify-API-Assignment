import dotenv from 'dotenv'

dotenv.config()

export const spotifyConfig = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_REDIRECT_URI,

	// Spotify API endpoints
	authUrl: 'https://accounts.spotify.com/authorize',
	tokenUrl: 'https://accounts.spotify.com/api/token',
	apiBaseUrl: 'https://api.spotify.com/v1',

	// Scopes needed for the application
	scopes: [
		'user-read-private',
		'user-read-email',
		'user-top-read',
		'user-read-currently-playing',
		'user-read-playback-state',
		'user-modify-playback-state',
	],
}
